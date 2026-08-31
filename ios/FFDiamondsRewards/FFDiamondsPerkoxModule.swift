import Foundation
import UIKit
import WebKit
import React

@objc(FFDiamondsPerkoxModule)
class FFDiamondsPerkoxModule: RCTEventEmitter {
  public static var shared: FFDiamondsPerkoxModule?
  private var hasListeners = false

  override init() {
    super.init()
    FFDiamondsPerkoxModule.shared = self
  }

  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String]! {
    ["onPerkoxReward", "onPerkoxClose"]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  @objc(showOfferwall:resolver:rejecter:)
  func showOfferwall(
    options: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard let topVC = Self.topViewController() else {
        reject("NO_VIEW_CONTROLLER", "Unable to find top view controller", nil)
        return
      }

      let appId = options["appId"] as? String ?? ""
      let sdkKey = options["sdkKey"] as? String ?? ""
      let playerId = options["playerId"] as? String ?? ""
      let beta = options["beta"] as? Bool ?? false

      let controller = FFDiamondsPerkoxOfferwallViewController(
        appId: appId,
        sdkKey: sdkKey,
        playerId: playerId,
        beta: beta
      )
      topVC.present(controller, animated: true) {
        resolve(true)
      }
    }
  }

  @objc func sendRewardEvent(_ rewardData: [String: Any]) {
    if hasListeners {
      sendEvent(withName: "onPerkoxReward", body: rewardData)
    }
  }

  @objc func sendCloseEvent() {
    if hasListeners {
      sendEvent(withName: "onPerkoxClose", body: nil)
    }
  }

  private static func topViewController(from rootVC: UIViewController? = nil) -> UIViewController? {
    let root = rootVC ?? {
      if #available(iOS 13.0, *) {
        return UIApplication.shared.connectedScenes
          .compactMap { $0 as? UIWindowScene }
          .flatMap { $0.windows }
          .first(where: { $0.isKeyWindow })?.rootViewController
      }
      return UIApplication.shared.keyWindow?.rootViewController
    }()

    if let nav = root as? UINavigationController {
      return topViewController(from: nav.visibleViewController)
    }
    if let tab = root as? UITabBarController {
      return topViewController(from: tab.selectedViewController)
    }
    if let presented = root?.presentedViewController {
      return topViewController(from: presented)
    }
    return root
  }
}
