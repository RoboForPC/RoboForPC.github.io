window.HELP_IMPROVE_VIDEOJS = false;

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// 本地预览（localhost）时，素材文件还没放进来就在原位置显示一个写明文件路径的占位框，
// 文件放进去后自动正常显示，不用改 HTML。
// 线上网站不显示占位框：加载失败（网络中断、刚部署完等）时保留封面图，隔几秒自动重试
const IS_LOCAL_PREVIEW = ['localhost', '127.0.0.1', ''].includes(location.hostname);
const MAX_MEDIA_RETRIES = 2;

// 加查询参数换一个缓存键，避开浏览器缓存里那次失败的响应
function retryUrl(path, attempt) {
    return path + (path.includes('?') ? '&' : '?') + 'retry=' + attempt;
}

function handleVideoError(video, source, path) {
    if (IS_LOCAL_PREVIEW) {
        showPlaceholder(video, path);
        return;
    }
    const attempt = Number(video.dataset.retries || 0) + 1;
    if (attempt > MAX_MEDIA_RETRIES) return;
    video.dataset.retries = attempt;
    setTimeout(() => {
        source.src = retryUrl(path, attempt);
        video.load();
        if (video.classList.contains('managed')) syncManagedVideo(video);
    }, 2000 * attempt);
}

function handleImageError(img, path) {
    if (IS_LOCAL_PREVIEW) {
        showPlaceholder(img, path);
        return;
    }
    const attempt = Number(img.dataset.retries || 0) + 1;
    if (attempt > MAX_MEDIA_RETRIES) return;
    img.dataset.retries = attempt;
    setTimeout(() => {
        img.src = retryUrl(path, attempt);
    }, 2000 * attempt);
}

function showPlaceholder(media, path) {
    if (media.dataset.placeholderShown) return;
    media.dataset.placeholderShown = 'true';

    const box = document.createElement('div');
    box.className = 'media-placeholder';
    const isVideo = media.tagName === 'VIDEO';
    box.innerHTML = '<i class="fas ' + (isVideo ? 'fa-video' : 'fa-image') + ' fa-2x"></i>' +
        '<span></span><code></code>';
    box.querySelector('span').textContent = media.getAttribute('aria-label') || media.alt || '';
    box.querySelector('code').textContent = path;

    media.style.display = 'none';
    media.parentNode.insertBefore(box, media);
}

function setupMissingMediaPlaceholders() {
    document.querySelectorAll('video').forEach(video => {
        const sources = video.querySelectorAll('source');
        if (sources.length === 0) return;
        const last = sources[sources.length - 1];
        const path = last.getAttribute('src');
        last.addEventListener('error', () => handleVideoError(video, last, path));
        if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
            handleVideoError(video, last, path);
        }
    });

    document.querySelectorAll('img').forEach(img => {
        const path = img.getAttribute('src');
        img.addEventListener('error', () => handleImageError(img, path));
        if (img.complete && img.naturalWidth === 0) {
            handleImageError(img, path);
        }
    });
}

// class="managed" 的视频只在"没被隐藏且滚动到屏幕里"时播放，其余暂停，
// 这样页面上几十段视频不会同时下载和解码
const managedInView = new WeakMap();

function syncManagedVideo(video) {
    const shown = video.offsetParent !== null;
    if (shown && managedInView.get(video)) {
        video.play().catch(() => {});
    } else {
        video.pause();
    }
}

function syncAllManagedVideos() {
    document.querySelectorAll('video.managed').forEach(syncManagedVideo);
}

function setupManagedVideos() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            managedInView.set(entry.target, entry.isIntersecting);
            syncManagedVideo(entry.target);
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('video.managed').forEach(video => observer.observe(video));
}

// 速度跟踪部分的 vx / vy / ωz 标签页
function setupCommandTabs() {
    document.querySelectorAll('.command-tabs').forEach(tabs => {
        const items = tabs.querySelectorAll('li[data-target]');
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(other => {
                    other.classList.toggle('is-active', other === item);
                    document.getElementById(other.dataset.target).hidden = other !== item;
                });
                syncAllManagedVideos();
            });
        });
    });
}

// 选项按钮（负载、方向、轨迹编号）：显示 data-* 属性和所有已选选项都匹配的那一组视频
function setupClipSwitchers() {
    document.querySelectorAll('.clip-switcher').forEach(switcher => {
        const groups = switcher.querySelectorAll('.option-group');

        const update = () => {
            const selected = {};
            groups.forEach(group => {
                selected[group.dataset.option] = group.querySelector('.option-btn.is-active').dataset.value;
            });
            switcher.querySelectorAll('.clip').forEach(clip => {
                clip.hidden = !Object.keys(selected).every(key => clip.dataset[key] === selected[key]);
            });
            syncAllManagedVideos();
        };

        groups.forEach(group => {
            const buttons = group.querySelectorAll('.option-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    buttons.forEach(other => other.classList.toggle('is-active', other === button));
                    update();
                });
            });
        });

        update();
    });
}

// 脚本是 defer 加载的，执行时页面已解析完
setupMissingMediaPlaceholders();
setupCommandTabs();
setupClipSwitchers();
setupManagedVideos();
