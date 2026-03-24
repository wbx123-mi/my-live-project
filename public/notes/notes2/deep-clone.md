```javascript
function cloneDeep(obj, cloneMap = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (cloneMap.has(obj)) return cloneMap.get(obj);
  const result = Array.isArray(obj) ? [] : {};
  cloneMap.set(obj, result);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = cloneDeep(obj[key], cloneMap);
    }
  }
  return result;
}
```
