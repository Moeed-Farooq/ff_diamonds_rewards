import Foundation
import UIKit
import WebKit

@objc(FFDiamondsPerkoxOfferwallViewController)
class FFDiamondsPerkoxOfferwallViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
  private let appId: String
  private let sdkKey: String
  private let playerId: String
  private let beta: Bool

  private var webView: WKWebView!
  private var progressView: UIActivityIndicatorView!

  private let rewardPrefix = "PERKOX_REWARD:"
  private let sdkToken = "L1q2sLX123HdS4Zr5gW679WwC4xx1Qc4v58Wa0K9IHzWrVR3CwS1A11cQ3X45x"

  init(appId: String, sdkKey: String, playerId: String, beta: Bool) {
    self.appId = appId
    self.sdkKey = sdkKey
    self.playerId = playerId
    self.beta = beta
    super.init(nibName: nil, bundle: nil)
    modalPresentationStyle = .fullScreen
  }

  required init?(coder: NSCoder) {
    return nil
  }

  deinit {
    webView?.configuration.userContentController.removeScriptMessageHandler(forName: "perkox")
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .white
    setupWebView()
    setupProgress()
    loadOfferwall()
  }

  private func setupProgress() {
    if #available(iOS 13.0, *) {
      progressView = UIActivityIndicatorView(style: .large)
    } else {
      progressView = UIActivityIndicatorView(style: .whiteLarge)
    }
    progressView.translatesAutoresizingMaskIntoConstraints = false
    progressView.hidesWhenStopped = true
    view.addSubview(progressView)
    NSLayoutConstraint.activate([
      progressView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
      progressView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    ])
    progressView.startAnimating()
  }

  private func setupWebView() {
    let userContentController = WKUserContentController()
    userContentController.add(self, name: "perkox")

    let consoleHook = """
    (function() {
      var originalLog = console.log;
      console.log = function() {
        try {
          var msg = Array.prototype.slice.call(arguments).join(' ');
          if (msg.indexOf('PERKOX_REWARD:') === 0 && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.perkox) {
            window.webkit.messageHandlers.perkox.postMessage(msg);
          }
        } catch (e) {}
        return originalLog.apply(console, arguments);
      };
    })();
    """
    let script = WKUserScript(source: consoleHook, injectionTime: .atDocumentStart, forMainFrameOnly: false)
    userContentController.addUserScript(script)

    let config = WKWebViewConfiguration()
    config.userContentController = userContentController
    if #available(iOS 14.0, *) {
      config.defaultWebpagePreferences.allowsContentJavaScript = true
    }

    webView = WKWebView(frame: .zero, configuration: config)
    webView.navigationDelegate = self
    webView.uiDelegate = self
    webView.translatesAutoresizingMaskIntoConstraints = false
    view.insertSubview(webView, at: 0)

    NSLayoutConstraint.activate([
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      webView.topAnchor.constraint(equalTo: view.topAnchor),
      webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])

    let closeButton = UIButton(type: .system)
    closeButton.setTitle("Close", for: .normal)
    closeButton.translatesAutoresizingMaskIntoConstraints = false
    closeButton.addTarget(self, action: #selector(closeTapped), for: .touchUpInside)
    view.addSubview(closeButton)
    NSLayoutConstraint.activate([
      closeButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 8),
      closeButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
    ])
  }

  private func loadOfferwall() {
    if beta {
      if let url = URL(string: appendQuery(to: "https://beta.perkwall.com/")) {
        webView.load(URLRequest(url: url))
      }
      return
    }

    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      guard let self = self else { return }
      var domain = "https://perkwall.com/"
      if let endpoint = URL(string: "https://pub.perkox.com/v2/offerwall/fresh-domain?for=offerwall") {
        var request = URLRequest(url: endpoint, timeoutInterval: 5)
        request.httpMethod = "GET"
        if let data = URLSession.shared.synchronousDataTask(with: request),
           let body = String(data: data, encoding: .utf8) {
          let marker = "\"domain\":\""
          if let startRange = body.range(of: marker) {
            let valueStart = startRange.upperBound
            if let endRange = body.range(of: "\"", range: valueStart..<body.endIndex) {
              domain = String(body[valueStart..<endRange.lowerBound])
              if !domain.hasSuffix("/") {
                domain += "/"
              }
            }
          }
        }
      }

      let finalUrlString = self.appendQuery(to: domain)
      DispatchQueue.main.async {
        if let url = URL(string: finalUrlString) {
          self.webView.load(URLRequest(url: url))
        }
      }
    }
  }

  private func appendQuery(to base: String) -> String {
    var params: [String] = []
    func add(_ key: String, _ value: String?) {
      guard let value = value, !value.isEmpty,
            let encoded = value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
        return
      }
      params.append("\(key)=\(encoded)")
    }

    add("app_id", appId)
    add("sdk_key", sdkKey)
    add("player_id", playerId)
    add("package_id", Bundle.main.bundleIdentifier)
    params.append("platform=ios")
    add("sdk_token", sdkToken)
    add("device_model", UIDevice.current.model)
    add("device_type", UIDevice.current.userInterfaceIdiom == .pad ? "tablet" : "phone")
    add("device_vendor", "Apple")
    params.append("platform_name=iOS")
    add("platform_version", UIDevice.current.systemVersion)

    guard !params.isEmpty else { return base }
    let separator = base.contains("?") ? "&" : "?"
    return base + separator + params.joined(separator: "&")
  }

  @objc private func closeTapped() {
    handleClose()
  }

  private func handleClose() {
    FFDiamondsPerkoxModule.shared?.sendCloseEvent()
    dismiss(animated: true)
  }

  @objc private func handleEdgeSwipeBack(_ gesture: UIScreenEdgePanGestureRecognizer) {
    guard gesture.state == .ended else { return }

    if webView.canGoBack {
      webView.goBack()
      return
    }
    handleClose()
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    if view.gestureRecognizers?.contains(where: { $0.name == "ffDiamondsPerkoxEdgeBack" }) != true {
      let edge = UIScreenEdgePanGestureRecognizer(
        target: self,
        action: #selector(handleEdgeSwipeBack(_:))
      )
      edge.edges = .left
      edge.name = "ffDiamondsPerkoxEdgeBack"
      view.addGestureRecognizer(edge)
    }
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    guard let body = message.body as? String, body.hasPrefix(rewardPrefix) else { return }
    let jsonString = String(body.dropFirst(rewardPrefix.count))
    guard let data = jsonString.data(using: .utf8),
          let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
      return
    }

    var reward: [String: Any] = [:]
    reward["amount"] = json["amount"] ?? 0
    reward["txid"] = json["txid"] ?? ""
    reward["status"] = json["status"] ?? ""
    reward["publisher_id"] = json["publisher_id"] ?? 0
    reward["player_id"] = json["player_id"] ?? ""
    reward["timestamp"] = json["timestamp"] ?? 0
    FFDiamondsPerkoxModule.shared?.sendRewardEvent(reward)
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    progressView.stopAnimating()
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    progressView.stopAnimating()
  }

  func webView(
    _ webView: WKWebView,
    decidePolicyFor navigationAction: WKNavigationAction,
    decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
  ) {
    guard let url = navigationAction.request.url else {
      decisionHandler(.allow)
      return
    }

    if isStoreOrExternalAppUrl(url) {
      UIApplication.shared.open(url, options: [:], completionHandler: nil)
      decisionHandler(.cancel)
      return
    }

    let scheme = url.scheme?.lowercased() ?? ""
    if scheme != "http" && scheme != "https" && scheme != "about" && scheme != "blob" {
      if UIApplication.shared.canOpenURL(url) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
      }
      decisionHandler(.cancel)
      return
    }

    decisionHandler(.allow)
  }

  func webView(
    _ webView: WKWebView,
    createWebViewWith configuration: WKWebViewConfiguration,
    for navigationAction: WKNavigationAction,
    windowFeatures: WKWindowFeatures
  ) -> WKWebView? {
    if let url = navigationAction.request.url {
      if isStoreOrExternalAppUrl(url) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
      } else if navigationAction.targetFrame == nil {
        webView.load(navigationAction.request)
      }
    }
    return nil
  }

  private func isStoreOrExternalAppUrl(_ url: URL) -> Bool {
    let absolute = url.absoluteString.lowercased()
    let host = url.host?.lowercased() ?? ""
    let scheme = url.scheme?.lowercased() ?? ""

    if scheme == "itms" || scheme == "itms-apps" || scheme == "market" || scheme == "intent" {
      return true
    }

    return host.contains("apps.apple.com")
      || host.contains("itunes.apple.com")
      || host.contains("play.google.com")
      || host.contains("market.android.com")
      || absolute.contains("play.google.com/store")
  }
}

private extension URLSession {
  func synchronousDataTask(with request: URLRequest) -> Data? {
    var data: Data?
    let semaphore = DispatchSemaphore(value: 0)
    let task = dataTask(with: request) { responseData, _, _ in
      data = responseData
      semaphore.signal()
    }
    task.resume()
    _ = semaphore.wait(timeout: .now() + 6)
    return data
  }
}
