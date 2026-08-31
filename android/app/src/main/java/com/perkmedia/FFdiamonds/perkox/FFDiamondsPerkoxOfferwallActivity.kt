package com.perkmedia.FFdiamonds.perkox

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.ConsoleMessage
import android.webkit.DownloadListener
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Arguments
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/**
 * Perkox offerwall host that opens Play Store / App Store redirects externally.
 */
class FFDiamondsPerkoxOfferwallActivity : AppCompatActivity() {
  private lateinit var webView: WebView
  private lateinit var progressBar: ProgressBar

  private var appId: String? = null
  private var sdkKey: String? = null
  private var playerId: String? = null
  private var beta: Boolean = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    beta = intent.getBooleanExtra(EXTRA_BETA, false)
    appId = intent.getStringExtra(EXTRA_APP_ID)
    sdkKey = intent.getStringExtra(EXTRA_SDK_KEY)
    playerId = intent.getStringExtra(EXTRA_PLAYER_ID)

    if (appId.isNullOrBlank() || sdkKey.isNullOrBlank()) {
      Toast.makeText(this, "app_id and sdk_key are required", Toast.LENGTH_LONG).show()
      finish()
      return
    }

    setupUi()
    setupWebView()
    setupBackNavigation()
    Thread {
      val url = buildOfferwallUrl(beta)
      runOnUiThread { webView.loadUrl(url) }
    }.start()
  }

  private fun setupBackNavigation() {
    onBackPressedDispatcher.addCallback(
      this,
      object : OnBackPressedCallback(true) {
        override fun handleOnBackPressed() {
          if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
            return
          }
          FFDiamondsPerkoxModule.sendCloseEvent()
          finish()
        }
      },
    )
  }

  private fun setupUi() {
    val root = FrameLayout(this).apply {
      layoutParams = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT,
      )
      setBackgroundColor(0xFFFFFFFF.toInt())
    }

    progressBar = ProgressBar(this).apply {
      isIndeterminate = true
      layoutParams = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.WRAP_CONTENT,
        FrameLayout.LayoutParams.WRAP_CONTENT,
        android.view.Gravity.CENTER,
      )
    }

    webView = WebView(this).apply {
      layoutParams = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT,
      )
      visibility = View.INVISIBLE
    }

    root.addView(webView)
    root.addView(progressBar)
    setContentView(root)
  }

  @SuppressLint("SetJavaScriptEnabled")
  private fun setupWebView() {
    webView.settings.apply {
      javaScriptEnabled = true
      domStorageEnabled = true
      databaseEnabled = true
      loadWithOverviewMode = true
      useWideViewPort = true
      builtInZoomControls = false
      displayZoomControls = false
      cacheMode = WebSettings.LOAD_DEFAULT
      mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
      allowFileAccess = true
      allowContentAccess = true
    }

    webView.webViewClient = object : WebViewClient() {
      override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
        if (isStoreOrExternalAppUrl(url)) {
          view?.stopLoading()
          openExternal(url)
          return
        }
        progressBar.visibility = View.VISIBLE
      }

      override fun onPageFinished(view: WebView?, url: String?) {
        progressBar.visibility = View.GONE
        webView.visibility = View.VISIBLE
      }

      override fun onReceivedError(
        view: WebView?,
        request: WebResourceRequest?,
        error: WebResourceError?,
      ) {
        Log.e(TAG, "WebView error: ${error?.description}")
      }

      override fun shouldOverrideUrlLoading(
        view: WebView?,
        request: WebResourceRequest?,
      ): Boolean {
        val url = request?.url?.toString() ?: return false
        if (isStoreOrExternalAppUrl(url)) {
          return openExternal(url)
        }
        if (url.startsWith("http://") || url.startsWith("https://")) {
          return false
        }
        return openExternal(url)
      }
    }

    webView.webChromeClient = object : WebChromeClient() {
      override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
        val message = consoleMessage?.message() ?: return super.onConsoleMessage(consoleMessage)
        if (!message.startsWith(REWARD_PREFIX)) {
          return true
        }

        try {
          val json = JSONObject(message.removePrefix(REWARD_PREFIX))
          val params = Arguments.createMap().apply {
            putDouble("amount", json.optDouble("amount", 0.0))
            putString("txid", json.optString("txid", ""))
            putString("status", json.optString("status", ""))
            putInt("publisher_id", json.optInt("publisher_id", 0))
            putString("player_id", json.optString("player_id", ""))
            putDouble("timestamp", json.optLong("timestamp", 0L).toDouble())
          }
          FFDiamondsPerkoxModule.sendRewardEvent(params)
        } catch (error: Exception) {
          Log.e(TAG, "Error parsing reward", error)
        }
        return true
      }
    }

    webView.setDownloadListener(
      DownloadListener { url, _, _, _, _ ->
        try {
          startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        } catch (error: Exception) {
          Log.e(TAG, "Failed to open download url", error)
        }
      },
    )
  }

  private fun buildOfferwallUrl(isBeta: Boolean): String {
    if (isBeta) {
      return appendQuery("https://beta.perkwall.com/")
    }

    var domain = "https://perkwall.com/"
    try {
      val endpoint = "https://pub.perkox.com/v2/offerwall/fresh-domain?for=offerwall"
      val connection = (URL(endpoint).openConnection() as HttpURLConnection).apply {
        requestMethod = "GET"
        connectTimeout = 5000
        readTimeout = 5000
      }
      if (connection.responseCode == 200) {
        val body = BufferedReader(InputStreamReader(connection.inputStream)).use { it.readText() }
        val marker = "\"domain\":\""
        val start = body.indexOf(marker)
        if (start >= 0) {
          val valueStart = start + marker.length
          val valueEnd = body.indexOf('"', valueStart)
          if (valueEnd > valueStart) {
            domain = body.substring(valueStart, valueEnd)
            if (!domain.endsWith("/")) {
              domain += "/"
            }
          }
        }
      }
      connection.disconnect()
    } catch (error: Exception) {
      Log.e(TAG, "Failed to fetch fresh domain", error)
    }

    return appendQuery(domain)
  }

  private fun appendQuery(base: String): String {
    val params = mutableListOf<String>()
    fun add(key: String, value: String?) {
      if (value.isNullOrBlank()) return
      params += "$key=${URLEncoder.encode(value, "UTF-8")}"
    }

    add("app_id", appId)
    add("sdk_key", sdkKey)
    add("player_id", playerId)
    add("package_id", packageName)
    params += "platform=android"
    add("sdk_token", SDK_TOKEN)
    add("device_model", Build.MODEL)
    add(
      "device_type",
      if (Build.DEVICE.contains("tablet", ignoreCase = true)) "tablet" else "phone",
    )
    add("device_vendor", Build.MANUFACTURER)
    params += "platform_name=Android"
    add("platform_version", Build.VERSION.RELEASE)

    return if (params.isEmpty()) base else "$base?${params.joinToString("&")}"
  }

  private fun openExternal(url: String?): Boolean {
    if (url.isNullOrBlank()) {
      return true
    }

    return try {
      val intent =
        if (url.startsWith("intent://")) {
          Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
        } else {
          Intent(Intent.ACTION_VIEW, Uri.parse(url))
        }
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      startActivity(intent)
      true
    } catch (error: Exception) {
      if (url.startsWith("intent://")) {
        try {
          val fallbackMarker = "S.browser_fallback_url="
          val start = url.indexOf(fallbackMarker)
          if (start >= 0) {
            var fallback = url.substring(start + fallbackMarker.length)
            val end = fallback.indexOf(';')
            if (end >= 0) {
              fallback = fallback.substring(0, end)
            }
            fallback = Uri.decode(fallback)
            if (!fallback.isNullOrBlank()) {
              if (isStoreOrExternalAppUrl(fallback)) {
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(fallback)))
              } else {
                webView.loadUrl(fallback)
              }
            }
          }
        } catch (ignored: Exception) {
          Log.e(TAG, "Failed to open external url", error)
        }
      } else {
        Log.e(TAG, "Failed to open external url", error)
      }
      true
    }
  }

  @Deprecated("Deprecated in Java")
  override fun onBackPressed() {
    if (::webView.isInitialized && webView.canGoBack()) {
      webView.goBack()
      return
    }
    FFDiamondsPerkoxModule.sendCloseEvent()
    finish()
  }

  override fun onPause() {
    super.onPause()
    webView.onPause()
  }

  override fun onResume() {
    super.onResume()
    webView.onResume()
  }

  override fun onDestroy() {
    try {
      webView.stopLoading()
      webView.clearHistory()
      webView.clearCache(true)
      webView.loadUrl("about:blank")
      webView.removeAllViews()
      webView.destroy()
    } catch (_: Exception) {
    }
    super.onDestroy()
  }

  companion object {
    private const val TAG = "FFDiamondsPerkoxOfferwall"
    private const val REWARD_PREFIX = "PERKOX_REWARD:"
    private const val SDK_TOKEN =
      "L1q2sLX123HdS4Zr5gW679WwC4xx1Qc4v58Wa0K9IHzWrVR3CwS1A11cQ3X45x"

    const val EXTRA_APP_ID = "app_id"
    const val EXTRA_SDK_KEY = "sdk_key"
    const val EXTRA_PLAYER_ID = "player_id"
    const val EXTRA_BETA = "beta"
  }

  private fun isStoreOrExternalAppUrl(url: String?): Boolean {
    if (url.isNullOrBlank()) {
      return false
    }
    val lower = url.lowercase()
    return lower.startsWith("market://")
      || lower.startsWith("itms://")
      || lower.startsWith("itms-apps://")
      || lower.startsWith("intent://")
      || lower.contains("play.google.com/store")
      || lower.contains("play.google.com/apps")
      || lower.contains("market.android.com")
      || lower.contains("apps.apple.com")
      || lower.contains("itunes.apple.com")
  }
}
