
import { Asset } from 'expo-asset';

let cache: any = null;
export async function loadTuning(){
  if (cache) return cache;
  const asset = Asset.fromModule(require('../../config/tuning.json'));
  await asset.downloadAsync();
  const data = await fetch(asset.uri).then(r=>r.json());
  cache = data;
  return data;
}
