package com.perkmedia.FFdiamonds.perkox

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class FFDiamondsPerkoxModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  init {
    instance = this
  }

  override fun getName(): String = "FFDiamondsPerkoxModule"

  @ReactMethod
  fun showOfferwall(options: ReadableMap?, promise: Promise) {
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.reject("ACTIVITY_NOT_FOUND", "Current Activity does not exist")
      return
    }

    try {
      val intent = Intent(activity, FFDiamondsPerkoxOfferwallActivity::class.java)
      intent.putExtra(
        FFDiamondsPerkoxOfferwallActivity.EXTRA_APP_ID,
        options?.getString("appId") ?: "",
      )
      intent.putExtra(
        FFDiamondsPerkoxOfferwallActivity.EXTRA_SDK_KEY,
        options?.getString("sdkKey") ?: "",
      )
      intent.putExtra(
        FFDiamondsPerkoxOfferwallActivity.EXTRA_PLAYER_ID,
        options?.getString("playerId") ?: "",
      )
      intent.putExtra(
        FFDiamondsPerkoxOfferwallActivity.EXTRA_BETA,
        options?.hasKey("beta") == true && options.getBoolean("beta"),
      )
      activity.startActivity(intent)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("PERKOX_OFFERWALL_ERROR", error.message, error)
    }
  }

  @ReactMethod
  fun addListener(eventName: String) {
    // Required for RN NativeEventEmitter
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Required for RN NativeEventEmitter
  }

  fun sendEvent(eventName: String, params: WritableMap?) {
    if (reactContext.hasActiveReactInstance()) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    }
  }

  companion object {
    const val EVENT_ON_REWARD = "onPerkoxReward"
    const val EVENT_ON_CLOSE = "onPerkoxClose"

    @Volatile
    var instance: FFDiamondsPerkoxModule? = null
      private set

    fun sendRewardEvent(rewardParams: WritableMap) {
      instance?.sendEvent(EVENT_ON_REWARD, rewardParams)
    }

    fun sendCloseEvent() {
      instance?.sendEvent(EVENT_ON_CLOSE, null)
    }
  }
}
