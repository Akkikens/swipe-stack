
export type EventName = 'run_start'|'block_drop'|'perfect'|'trim'|'collapse'|'run_end'|'best_score'|'revive';
export function track(event: EventName, props: Record<string, any> = {}){
  // TODO: wire to PostHog/Amplitude
  if (__DEV__) console.log('[analytics]', event, props);
}
