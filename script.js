// --- 1. Robust Video ID Extractor (Now supports SHORTS) ---
function getVideoId(url) {
    if (!url) return null;

    // Updated Regex to include 'shorts/'
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    // Return the ID (match[2]) if it is 11 characters long
    return (match && match[2].length === 11) ? match[2] : null;
}

// --- 2. Dynamic URL Logic ---
function dynamicUrl(type) {
    const urlInput = document.getElementById('url');
    const img = document.getElementById('img');
    const videoId = getVideoId(urlInput.value);

    // Error Handling: If no valid ID, warn user
    if (!videoId) {
        // Only alert if the user actually typed something
        if (urlInput.value.length > 5) {
            alert("Could not find video ID. Please check the URL.");
        }
        return;
    }

    let imgUrl;
    // type 0 = Standard (HQ)
    // type 1 = HD (MaxRes JPG)
    // type 2 = 4K/WebP
    if (type === 1) {
        imgUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (type === 2) {
        imgUrl = `https://img.youtube.com/vi_webp/${videoId}/maxresdefault.webp`;
    } else {
        imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    // Update the image
    img.src = imgUrl;
}

// --- 3. Fixed Download Function ---
async function download() {
    const img = document.getElementById('img');
    const imgUrl = img.src;
    const btn = document.querySelector('.btn-primary');

    // Visual Feedback
    const originalText = btn.innerText;
    btn.innerText = "Processing...";

    // Check if we have a valid image source (not the default placeholder)
    if (imgUrl.includes('k8mOAV0KJLE')) {
        alert("Please paste a URL first!");
        btn.innerText = originalText;
        return;
    }

    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Check extension
        const ext = imgUrl.endsWith('.webp') ? 'webp' : 'jpg';

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `thumbnail_${Date.now()}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed', error);
        // Fallback
        window.open(imgUrl, '_blank');
    } finally {
        setTimeout(() => { btn.innerText = originalText; }, 500);
    }
}

// --- 4. Zoom Modal Logic ---
function fullPage() {
    const fullPageModal = document.querySelector('#fullpage');
    const img = document.getElementById('img');

    fullPageModal.style.backgroundImage = 'url(' + img.src + ')';
    fullPageModal.style.display = 'block';
}

// --- 5. Auto-Update Logic ---
document.getElementById('url').addEventListener('input', function() {
    // Attempt to extract ID as user types/pastes
    const id = getVideoId(this.value);
    if (id) {
        dynamicUrl(1); // Auto-load HD version if valid ID found
    }
});