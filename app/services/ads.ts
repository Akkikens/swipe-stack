
let interstitialReady = true;
export function initAds(){ /* AppLovin MAX init stub */ }
export function showInterstitial(){ if (interstitialReady) console.log('[ads] interstitial'); }
export async function showRewarded(): Promise<boolean>{
  console.log('[ads] rewarded watched');
  return true; // simulate success
}
