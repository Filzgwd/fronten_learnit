# ✅ COMPLETE FIX FOR DELETE MATERIAL 401 → 500 ERROR

## 🎯 Problems Found & Fixed

### Problem 1: Authorization Header Not Sent ✅ FIXED
**Cause:** Axios interceptor missing
**Fix:** Added in `src/axios/axios.js`
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
**Status:** ✅ Pushed to frontend repo

### Problem 2: Material ID Format Mismatch
**Cause:** Default materials use integer ID (1,2,3) but backend expect UUID
**When:** Backend fetch fails, frontend uses default materials
**Result:** `/materials/1` → 500 Error in backend
**Fix Needed:** Update default materials to use UUID-like format

---

## 🔧 FRONTEND FIXES NEEDED

### Fix 1: Update Default Materials IDs

Update [src/features/materials/learningPaths.js](src/features/materials/learningPaths.js):

```javascript
export const defaultMaterials = [
  {
    id: "00000000-0000-0000-0000-000000000001", // Changed from id: 1
    title: "Pengertian Algoritma Pemrograman",
    // ... rest of fields
  },
  {
    id: "00000000-0000-0000-0000-000000000002", // Changed from id: 2
    // ...
  },
  // etc... change all integer IDs to UUID format
];
```

**Why:** Ensures consistency with backend UUID format

### Fix 2: Clear Vercel Cache

After push, Vercel may serve old build.

**Option A: Force Rebuild**
1. Go to Vercel dashboard
2. Project → Deployments
3. Latest deployment → Redeploy

**Option B: Hard Refresh**
1. `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Refresh page

### Fix 3: Verify Authorization Header Sent

After deploy, check in DevTools:
1. DevTools (F12) → Network tab
2. Try delete material
3. Find DELETE request
4. Headers tab → Authorization: Bearer {token} ✅

---

## 🧪 TEST AFTER FIXES

### Step 1: Login Fresh
1. Refresh page
2. Logout if logged in
3. Login again with admin@gmail.com / Admin123
4. Check localStorage has authToken

### Step 2: Test Delete
1. Open DevTools (F12)
2. Network tab
3. Try delete material
4. Check:
   - ✅ Authorization header present
   - ✅ Status 200 (not 401 or 500)
   - ✅ Response: "Materi berhasil dihapus"

### Step 3: Verify Material Deleted
1. Refresh page
2. Material should be gone from list

---

## 📋 CHECKLIST

### Backend
- [x] CORS fixed
- [x] JWT_SECRET consistent
- [x] Auth middleware working
- [x] Authorization header support

### Frontend
- [x] Authorization header interceptor added
- [ ] **Default materials IDs need update to UUID** (TO DO)
- [ ] Clear Vercel cache / Force rebuild
- [ ] Test delete material

---

## 🚀 DEPLOY SEQUENCE

1. **Update learningPaths.js** - Change default material IDs to UUID format
2. **Git add & commit** - `git add -A && git commit -m "Fix: Update default material IDs to UUID format"`
3. **Git push** - `git push origin main`
4. **Wait for Vercel** - Should auto-deploy (~1-2 mins)
5. **Clear cache** - Ctrl+Shift+R or manual Vercel redeploy
6. **Test** - Try delete material again

---

## 🆘 If Still Error

### 401 Unauthorized
- [ ] Clear localStorage
- [ ] Login again
- [ ] Check DevTools → Authorization header present

### 500 Internal Server Error
- [ ] Verify material ID is UUID format
- [ ] Check default materials use correct ID format
- [ ] Check backend logs for errors

### Material data wrong
- [ ] Backend fetch returning empty?
- [ ] Frontend falling back to defaultMaterials?
- [ ] Update default materials IDs

---

## 📝 What Changed

**Frontend (`src/axios/axios.js`):**
```javascript
// ADDED: Authorization header interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Backend (`.env`):**
- JWT_SECRET updated to match production
- CORS optionsSuccessStatus fixed

---

## ✅ Next: Update Default Material IDs

Lihat learningPaths.js dan update semua id integer menjadi UUID format!
