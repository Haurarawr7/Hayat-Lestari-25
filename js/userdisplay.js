
console.log("userdisplay.js berhasil dimuat")

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  //  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import {
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCWdQ39H_2GM50snDLdTMYAVtelSrnt01Y",
    authDomain: "hayatlestari.firebaseapp.com",
    projectId: "hayatlestari",
    storageBucket: "hayatlestari.firebasestorage.app",
    messagingSenderId: "217729489546",
    appId: "1:217729489546:web:d8692bf5b1174cca64eb73",
    measurementId: "G-XETW0GKMN7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const auth = getAuth(app);


// navbar usr info
function displayUserInfo(user) {
  if (!user) return;
  
  console.log("Tampilkan info user:", user.displayName || user.email);
  
  // suser dropdown
  const userDropdown = document.getElementById('user-dropdown');
  if (userDropdown) {
    userDropdown.classList.remove('d-none');
  }
  
  // user name
  const navbarUserName = document.getElementById('navbar-user-name');
  if (navbarUserName) {
    navbarUserName.textContent = user.displayName || user.email.split('@')[0];
  }
  
  // user photo
  const navbarUserPhoto = document.getElementById('navbar-user-photo');
  if (navbarUserPhoto) {
    if (user.photoURL) {
      navbarUserPhoto.src = user.photoURL;
      navbarUserPhoto.onerror = () => {
        // Fallback to default avatar if photo fails to load
        setDefaultAvatar(navbarUserPhoto, user);
      };
    } else {
      setDefaultAvatar(navbarUserPhoto, user);
    }
    navbarUserPhoto.alt = user.displayName || 'User Profile';
  }
  
  // Update
  updateHeroGreeting(user);
}

// jangan lupa avatarnya benerin

function setDefaultAvatar(imgElement, user) {
  const name = user.displayName || user.email || 'User';
  const initial = name.charAt(0).toUpperCase();
  
  imgElement.src = user.photoURL;
}

// ubah nama
function updateHeroGreeting(user) {
  const heroTitle = document.querySelector('.hero-title b');
  if (heroTitle) {
    const currentText = heroTitle.textContent;
    if (currentText.includes('Selamat Datang, User') || currentText.includes('Selamat Datang')) {
      const userName = user.displayName || user.email.split('@')[0];
      heroTitle.textContent = `Selamat Datang, ${userName}`;
    }
  }
}


// Logout
async function handleLogout() {
  const confirmed = confirm('Apakah Anda yakin ingin logout?');
  
  if (!confirmed) return;
  
  try {
    await signOut(auth);
    console.log("Logout successful");
    
    alert('Logout berhasil!');
    window.location.href = 'index.html'; // buat balik ke index (bisi lupa)
    
  } catch (error) {
    console.error("Logout error:", error);
    alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
  }
}

// protect page
function protectPage() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Stop listening after first check
      
      if (!user) {
        console.log(" tidak ada user, mengembalikan ke halsman sebelumnya...");
        alert('Silakan login terlebih dahulu!');
        window.location.href = 'index.html';
        resolve(false);
      } else {
        console.log("User terautikasi", user.email);
        resolve(true);
      }
    });
  });
}

document.addEventListener('ContentLoaded', async function() {
  console.log("munculin display user");
  
  // yang di protek apa aja?
  const protectedPages = ['userinterface.html', 'laporan.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  // di protek gak?
  if (protectedPages.includes(currentPage)) {
    console.log("Protected page ini");
    await protectPage();
  }
  
  // rubah state auth
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user gak kedetek", user.email);
      displayUserInfo(user);
    } else {
      console.log("gak ada user");
    }
  });
});

// ===== EXPORT FUNCTIONS TO WINDOW =====
window.handleLogout = handleLogout;
window.protectPage = protectPage;

console.log("User display script initialized");