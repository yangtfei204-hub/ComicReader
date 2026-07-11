/**
 * 📚 ComicReader Extension for SillyTavern
 * 
 * 基于精致拖拽悬浮窗与主题系统的漫画阅读器
 */

const MODULE_NAME = 'comic_reader_ext';
let panelElement = null;
let floatBadgeElement = null;
let settingsDialogElement = null;
let helpDialogElement = null;
let importConfigDialogElement = null;
let tocDialogElement = null;

const THEMES = {
    pink:           { name: '🩷 樱花粉',     emoji: '🐾' },
    lemon:          { name: '🌼 嫩黄',       emoji: '🍋' },
    mint:           { name: '🌿 淡绿',       emoji: '🌱' },
    'glass-light':  { name: '🪟 毛玻璃白',   emoji: '☁️' },
    'glass-dark':   { name: '🕶️ 毛玻璃黑',   emoji: '🌙' },
    sakura:         { name: '🌸 夜樱',       emoji: '🌸' },
    ocean:          { name: '🌊 深海蓝',     emoji: '🐳' },
    sunset:         { name: '🌅 落日橘',     emoji: '🌇' },
    lavender:       { name: '💜 薰衣草',     emoji: '🪻' },
    mocha:          { name: '☕ 摩卡棕',     emoji: '🍫' }
};


const BADGE_DIMENSIONS = {
    large:  { w: 72, h: 76 },
    medium: { w: 58, h: 62 },
    small:  { w: 44, h: 48 }
};

const THEME_COLORS = {
    pink: {
        primary: '#ff85a7', primaryLight: '#fff0f3', primaryDeep: '#fb7299',
        secondary: '#86e3ce', bg: '#ffffff', bgSoft: '#fffbfc', text: '#5d6d7e',
        textMuted: '#b8a4ad', border: '#ff85a7', actionPrimary: '#ff85a7',
        actionPrimaryText: '#ffffff', actionSecondary: '#86e3ce',
        actionSecondaryText: '#2c3e50', shadow: 'rgba(251, 114, 153, 0.2)'
    },
    lemon: {
        primary: '#f4d35e', primaryLight: '#fff8d6', primaryDeep: '#ee9b00',
        secondary: '#ffd166', bg: '#fffdf5', bgSoft: '#fffbea', text: '#6b5d3f',
        textMuted: '#b8a87d', border: '#ee9b00', actionPrimary: '#ee9b00',
        actionPrimaryText: '#ffffff', actionSecondary: '#ffd166',
        actionSecondaryText: '#6b5d3f', shadow: 'rgba(244, 211, 94, 0.3)'
    },
    mint: {
        primary: '#95d5b2', primaryLight: '#d8f3dc', primaryDeep: '#52b788',
        secondary: '#b7e4c7', bg: '#ffffff', bgSoft: '#f1faf3', text: '#3d5a45',
        textMuted: '#8aab92', border: '#52b788', actionPrimary: '#52b788',
        actionPrimaryText: '#ffffff', actionSecondary: '#95d5b2',
        actionSecondaryText: '#3d5a45', shadow: 'rgba(82, 183, 136, 0.25)'
    },
    'glass-light': {
        primary: '#8b9bb4', primaryLight: 'rgba(255,255,255,0.5)', primaryDeep: '#5d6d7e',
        secondary: '#c9d6e2', bg: 'rgba(255,255,255,0.55)', bgSoft: 'rgba(245,248,252,0.6)',
        text: '#3d4a5c', textMuted: '#8a99ad', border: 'rgba(139,155,180,0.5)',
        actionPrimary: '#5d6d7e', actionPrimaryText: '#ffffff',
        actionSecondary: '#c9d6e2', actionSecondaryText: '#3d4a5c',
        shadow: 'rgba(100, 120, 150, 0.2)'
    },
    'glass-dark': {
        primary: '#b794d4', primaryLight: 'rgba(60,50,80,0.5)', primaryDeep: '#d4a5e8',
        secondary: '#7c9eb2', bg: 'rgba(30,25,45,0.55)', bgSoft: 'rgba(40,35,55,0.6)',
        text: '#e8e3f0', textMuted: '#9a8fb0', border: 'rgba(183,148,212,0.4)',
        actionPrimary: '#b794d4', actionPrimaryText: '#1a1525',
        actionSecondary: '#7c9eb2', actionSecondaryText: '#1a1525',
        shadow: 'rgba(0, 0, 0, 0.5)'
    },
    sakura: {
        primary: '#f8a5c2', primaryLight: 'rgba(60, 40, 55, 0.6)', primaryDeep: '#ff6b9d',
        secondary: '#c39bd3', bg: 'rgba(40, 30, 45, 0.7)', bgSoft: 'rgba(50, 38, 58, 0.65)',
        text: '#f5e6ee', textMuted: '#b094a6', border: 'rgba(248, 165, 194, 0.5)',
        actionPrimary: '#ff6b9d', actionPrimaryText: '#ffffff',
        actionSecondary: '#c39bd3', actionSecondaryText: '#2a1f15',
        shadow: 'rgba(255, 107, 157, 0.3)'
    },
    ocean: {
        primary: '#48cae4', primaryLight: '#caf0f8', primaryDeep: '#0077b6',
        secondary: '#90e0ef', bg: '#ffffff', bgSoft: '#f0fbfd', text: '#023e58',
        textMuted: '#8ab4c8', border: '#0077b6',
        actionPrimary: '#0077b6', actionPrimaryText: '#ffffff',
        actionSecondary: '#90e0ef', actionSecondaryText: '#023e58',
        shadow: 'rgba(0, 119, 182, 0.25)'
    },
    sunset: {
        primary: '#ffb07c', primaryLight: '#fff0e0', primaryDeep: '#ff7e3c',
        secondary: '#ffd6a5', bg: '#fffaf5', bgSoft: '#fff3e8', text: '#6b4423',
        textMuted: '#c4a382', border: '#ff7e3c',
        actionPrimary: '#ff7e3c', actionPrimaryText: '#ffffff',
        actionSecondary: '#ffd6a5', actionSecondaryText: '#6b4423',
        shadow: 'rgba(255, 126, 60, 0.3)'
    },
    lavender: {
        primary: '#c8a2d4', primaryLight: '#f3e5f7', primaryDeep: '#9c6bc7',
        secondary: '#e1bee7', bg: '#ffffff', bgSoft: '#faf5fc', text: '#5a4570',
        textMuted: '#b094c4', border: '#9c6bc7',
        actionPrimary: '#9c6bc7', actionPrimaryText: '#ffffff',
        actionSecondary: '#e1bee7', actionSecondaryText: '#5a4570',
        shadow: 'rgba(156, 107, 199, 0.25)'
    },
    mocha: {
        primary: '#c9a883', primaryLight: 'rgba(60, 45, 35, 0.6)', primaryDeep: '#a07855',
        secondary: '#d4b896', bg: 'rgba(45, 35, 28, 0.75)', bgSoft: 'rgba(55, 42, 33, 0.7)',
        text: '#f0e6d8', textMuted: '#a89880', border: 'rgba(201, 168, 131, 0.5)',
        actionPrimary: '#a07855', actionPrimaryText: '#ffffff',
        actionSecondary: '#d4b896', actionSecondaryText: '#2a1f15',
        shadow: 'rgba(160, 120, 85, 0.35)'
    }
};

const DEFAULT_SETTINGS = {
    theme: 'pink',
    badgeSize: 'medium',
    avatarType: 'emoji',
    avatarValue: '',
    borderImage: '',
    borderImageMode: 'background',
    borderImageFit: 'cover',
    borderImageOpacity: 1,
    customColors: null,
    readerFontSize: 16,
    layoutMode: 'grid',
    startAsFloating: true,
    // 🔧 漫画阅读器自定义设置
    readerBgImage: '',
    readerBgOpacity: 0.3,
    readingMode: 'scroll', // 'scroll' 滚动模式 | 'flip' 翻页模式
    fitMode: 'width', // 'width' 适应宽度 | 'height' 适应高度 | 'original' 原始大小
    pageDirection: 'ltr', // 'ltr' 左到右 | 'rtl' 右到左（日漫）
    // 📚 漫画封面自定义设置
    comicCovers: {}
};



const state = {
    isCollapsed: false,
    isFloating: false,
    savedHeight: '520px',
    savedWidth: '680px',
    savedPos: null,
    settings: { ...DEFAULT_SETTINGS },
    comics: [],
    activeComicId: null,
    activePageIndex: 0,
    searchQuery: ''
};

// ==================== IndexedDB 核心 ====================
let dbInstance = null;

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ComicReaderDB', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('pages')) {
                db.createObjectStore('pages', { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => {
            dbInstance = e.target.result;
            resolve();
        };
        request.onerror = (e) => {
            console.error('IndexedDB 初始化失败:', e);
            reject(e);
        };
    });
}

function savePageToDB(comicId, pageIndex, imageData, thumbnail = null) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['pages'], 'readwrite');
        const store = transaction.objectStore('pages');
        const data = {
            id: `${comicId}_${pageIndex}`,
            comicId,
            pageIndex,
            imageData,
            thumbnail: thumbnail || imageData
        };
        const req = store.put(data);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

function getPageFromDB(comicId, pageIndex) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['pages'], 'readonly');
        const store = transaction.objectStore('pages');
        const req = store.get(`${comicId}_${pageIndex}`);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function deleteComicPagesFromDB(comicId) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) return reject('DB未初始化');
        const transaction = dbInstance.transaction(['pages'], 'readwrite');
        const store = transaction.objectStore('pages');
        
        const request = store.openCursor();
        const deletePromises = [];
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.comicId === comicId) {
                    deletePromises.push(cursor.delete());
                }
                cursor.continue();
            } else {
                Promise.all(deletePromises).then(resolve).catch(reject);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// ==================== 错误处理 ====================
function handleError(error, userMessage = '操作失败') {
    console.error('[ComicReader]', error);
    alert(`${userMessage}: ${error.message || error}`);
}

// ==================== 数据保存与恢复 ====================
function loadExtensionSettings() {
    try {
        const context = window.SillyTavern?.extensions_settings;
        let saved = null;
        if (context && context[MODULE_NAME]) {
            saved = context[MODULE_NAME];
        }
        if (!saved) {
            const local = localStorage.getItem(MODULE_NAME);
            if (local) {
                try { saved = JSON.parse(local); } catch (e) {}
            }
        }
        if (saved) {
            state.comics = saved.comics || [];
            state.savedPos = saved.lastPos || null;
            state.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
            
            if (!state.settings.comicCovers) {
                state.settings.comicCovers = {};
                saveExtensionSettings();
            }
        } else {
            saveExtensionSettings();
        }
    } catch (e) {
        console.warn("[ComicReader] 配置读取失败", e);
    }
}




function saveExtensionSettings() {
    let pos = null;
    if (panelElement && !state.isFloating && panelElement.style.display !== 'none') {
        const rect = panelElement.getBoundingClientRect();
        pos = { left: rect.left, top: rect.top };
    }

    const data = {
        comics: state.comics,
        lastPos: pos,
        settings: state.settings
    };

    localStorage.setItem(MODULE_NAME, JSON.stringify(data));

    const context = window.SillyTavern?.extensions_settings;
    if (context) {
        context[MODULE_NAME] = data;
        window.saveSettingsDebounced?.();
    }
}

// 🔧 防抖版本，用于翻页等高频操作
let _saveTimer = null;
function saveExtensionSettingsDebounced() {
    if (_saveTimer) clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => saveExtensionSettings(), 500);
}


// ==================== 备份导出/导入（优化版） ====================
async function exportBackup() {
    try {
        const backupData = {
            version: '1.0.0',
            comics: state.comics,
            pages: []
        };
        
        for (const comic of state.comics) {
            for (let i = 0; i < comic.pagesCount; i++) {
                const page = await getPageFromDB(comic.id, i);
                if (page) {
                    backupData.pages.push({
                        comicId: comic.id,
                        pageIndex: i,
                        imageData: page.imageData,
                        thumbnail: page.thumbnail
                    });
                }
            }
        }

        const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `📚ComicReader备份_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (err) {
        handleError(err, '导出备份失败');
    }
}

async function importBackup(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.comics || !data.pages) {
                throw new Error('无效的备份文件格式');
            }
            
            const totalPages = data.pages.length;
            let processed = 0;
            
            for (const newComic of data.comics) {
                if (!state.comics.some(c => c.id === newComic.id)) {
                    state.comics.push(newComic);
                }
            }
            
            // 批量处理，避免阻塞
            const batchSize = 100;
            for (let i = 0; i < data.pages.length; i += batchSize) {
                const batch = data.pages.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(p => 
                        savePageToDB(p.comicId, p.pageIndex, p.imageData, p.thumbnail)
                    )
                );
                processed += batch.length;
            }

            saveExtensionSettings();
            renderShelf();
            alert(`备份恢复成功！共导入 ${data.comics.length} 本漫画，${totalPages} 页。`);
        } catch (err) {
            handleError(err, '恢复备份失败');
        }
    };
    reader.onerror = () => handleError(reader.error, '文件读取失败');
    reader.readAsText(file);
}

// ==================== 图片处理工具 ====================
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('不是有效的图片文件'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function generateThumbnail(base64Data, maxSize = 200) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxSize) {
                    height = Math.floor((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.floor((width * maxSize) / height);
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => resolve(base64Data);
        img.src = base64Data;
    });
}

function naturalSort(a, b) {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}

// ==================== 主题系统（完全隔离版） ====================
function applyTheme() {
    const theme = state.settings.theme;
    const colors = state.settings.customColors || THEME_COLORS[theme] || THEME_COLORS.pink;

    // 获取所有需要应用主题的元素
    const elements = [
        panelElement, 
        floatBadgeElement, 
        settingsDialogElement, 
        helpDialogElement, 
        importConfigDialogElement, 
        tocDialogElement
    ].filter(Boolean);
    
    // 为每个元素单独设置 CSS 变量和主题属性
    elements.forEach(el => {
        // 先设置主题属性
        el.setAttribute('data-novel-theme', theme);
        
        // 强制设置所有 CSS 变量（避免继承污染）
        el.style.setProperty('--kp-primary', colors.primary);
        el.style.setProperty('--kp-primary-light', colors.primaryLight);
        el.style.setProperty('--kp-primary-deep', colors.primaryDeep);
        el.style.setProperty('--kp-secondary', colors.secondary);
        el.style.setProperty('--kp-bg', colors.bg);
        el.style.setProperty('--kp-bg-soft', colors.bgSoft);
        el.style.setProperty('--kp-text', colors.text);
        el.style.setProperty('--kp-text-muted', colors.textMuted);
        el.style.setProperty('--kp-border', colors.border);
        el.style.setProperty('--kp-action-primary', colors.actionPrimary);
        el.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
        el.style.setProperty('--kp-action-secondary', colors.actionSecondary);
        el.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
        el.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
    });

    applyBorderImage();
    updateBadgeAvatar();

    // 更新面板标题
    if (panelElement) {
        const titleEl = panelElement.querySelector('.novel-ext-header .title');
        if (titleEl) {
            titleEl.textContent = `${THEMES[theme].emoji} ComicReader ${THEMES[theme].emoji}`;
        }
    }
}

// 🔧 新增：应用阅读器自定义样式
function applyReaderStyles() {
    const readerContent = document.getElementById('novel-reader-content');
    const readerContainer = document.getElementById('novel-reader-container');
    if (!readerContent || !readerContainer) return;

    // 应用背景图片
    if (state.settings.readerBgImage) {
        readerContainer.style.backgroundImage = `url("${state.settings.readerBgImage}")`;
        readerContainer.style.backgroundSize = 'cover';
        readerContainer.style.backgroundPosition = 'center';
        readerContainer.style.backgroundRepeat = 'no-repeat';
        readerContainer.style.position = 'relative';
        
        // 添加半透明遮罩层
        let overlay = readerContainer.querySelector('.novel-reader-bg-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'novel-reader-bg-overlay';
            overlay.style.cssText = `
                position: absolute;
                inset: 0;
                background: var(--kp-bg);
                pointer-events: none;
                z-index: 0;
            `;
            readerContainer.insertBefore(overlay, readerContainer.firstChild);
        }
        overlay.style.opacity = state.settings.readerBgOpacity;
        readerContent.style.position = 'relative';
        readerContent.style.zIndex = '1';
    } else {
        readerContainer.style.backgroundImage = '';
        const overlay = readerContainer.querySelector('.novel-reader-bg-overlay');
        if (overlay) overlay.remove();
    }
}




function applyBorderImage() {
    if (!panelElement) return;
    const oldLayer = panelElement.querySelector('.novel-border-image-layer');
    if (oldLayer) oldLayer.remove();

    if (!state.settings.borderImage) {
        panelElement.classList.remove('novel-has-border-image');
        panelElement.removeAttribute('data-border-mode');
        return;
    }

    panelElement.classList.add('novel-has-border-image');
    const mode = state.settings.borderImageMode || 'background';
    panelElement.setAttribute('data-border-mode', mode);

    const layer = document.createElement('div');
    layer.className = 'novel-border-image-layer';
    layer.style.backgroundImage = `url("${state.settings.borderImage}")`;

    const fit = state.settings.borderImageFit || 'cover';
    if (fit === 'repeat') {
        layer.style.backgroundSize = 'auto';
        layer.style.backgroundRepeat = 'repeat';
    } else if (fit === 'stretch') {
        layer.style.backgroundSize = '100% 100%';
        layer.style.backgroundRepeat = 'no-repeat';
    } else {
        layer.style.backgroundSize = fit;
        layer.style.backgroundRepeat = 'no-repeat';
    }
    layer.style.backgroundPosition = 'center';
    layer.style.opacity = state.settings.borderImageOpacity;

    panelElement.insertBefore(layer, panelElement.firstChild);
}

function updateBadgeAvatar() {
    if (!floatBadgeElement) return;
    const circle = floatBadgeElement.querySelector('.novel-badge-circle');
    if (!circle) return;
    const faceEl = circle.querySelector('.novel-badge-text-face');
    const imgEl = circle.querySelector('.novel-badge-avatar-img');
    const { avatarType, avatarValue } = state.settings;
    if (imgEl) imgEl.remove();
    
    if (avatarType === 'emoji' || !avatarValue) {
        circle.style.background = '';
        circle.style.backgroundImage = '';
        if (!faceEl) {
            const newFace = document.createElement('div');
            newFace.className = 'novel-badge-text-face';
            newFace.textContent = avatarValue || THEMES[state.settings.theme].emoji;
            circle.appendChild(newFace);
        } else {
            faceEl.textContent = avatarValue || THEMES[state.settings.theme].emoji;
            faceEl.style.display = '';
        }
    } else if (avatarType === 'url' || avatarType === 'upload') {
        if (faceEl) faceEl.style.display = 'none';
        const img = document.createElement('img');
        img.className = 'novel-badge-avatar-img';
        img.src = avatarValue;
        img.alt = 'avatar';
        img.onerror = () => {
            img.remove();
            if (faceEl) {
                faceEl.style.display = '';
                faceEl.textContent = THEMES[state.settings.theme].emoji;
            }
        };
        circle.appendChild(img);
    }
}


// ==================== 图片压缩工具 ====================
function compressImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            const originalSizeKB = (file.size / 1024).toFixed(1);
            const compressedSizeKB = ((compressedDataUrl.length * 0.75) / 1024).toFixed(1);
            
            console.log(`[ComicReader] 封面压缩：${originalSizeKB}KB → ${compressedSizeKB}KB (${width}×${height})`);
            
            if (compressedSizeKB > 500) {
                alert(`⚠️ 压缩后图片仍较大（${compressedSizeKB}KB）\n可能影响性能，建议使用更小的图片。`);
            }
            
            callback(compressedDataUrl);
        };
        img.onerror = () => {
            alert('图片加载失败，请选择有效的图片文件。');
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        alert('文件读取失败，请重试。');
    };
    reader.readAsDataURL(file);
}


// ==================== 渲染书架 ====================
function renderShelf() {
    const container = document.getElementById('novel-shelf-container');
    if (!container) return;
    container.innerHTML = '';

    const layout = state.settings.layoutMode || 'grid';
    container.className = `novel-shelf-${layout}`;

    const query = state.searchQuery.trim().toLowerCase();
    const filteredComics = state.comics.filter(c => c.title.toLowerCase().includes(query));

    if (filteredComics.length === 0) {
        container.innerHTML = `<div class="novel-empty-tip">📚 书架上还没有漫画噢，赶紧导入吧~</div>`;
        return;
    }

    filteredComics.forEach(comic => {
        const item = document.createElement('div');
        item.className = 'novel-book-card';
        
        let displayTitle = comic.title;
        if (query) {
            const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
            displayTitle = comic.title.replace(regex, '<mark class="novel-search-highlight">\$1</mark>');
        }

        const coverConfig = state.settings?.comicCovers?.[comic.id];
        let coverStyle = '';
        let coverContent = '';

        if (coverConfig?.type === 'image' && coverConfig.value) {
            const imageUrl = coverConfig.value;
            coverStyle = `background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
            coverContent = '';
        } else if (coverConfig?.type === 'text' && coverConfig.value) {
            const coverColor = getHashColor(comic.id);
            coverStyle = `background: ${coverColor};`;
            coverContent = `<div class="novel-cover-text">${escapeHtml(coverConfig.value)}</div>`;
        } else {
            const coverColor = getHashColor(comic.id);
            coverStyle = `background: ${coverColor};`;
            coverContent = `<div class="novel-cover-inner">📚</div>`;
        }

        const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

        item.innerHTML = `
            <div class="novel-book-cover" style="${coverStyle}" title="${isMobile ? '点击阅读 · 长按编辑封面' : '左键阅读 · 右键编辑封面'}">
                ${coverContent}
            </div>
            <div class="novel-book-info">
                <div class="novel-book-title-wrap">
                    <span class="novel-book-title" title="点击阅读 · 双击修改">${displayTitle}</span>
                </div>
                <div class="novel-book-progress">读至第 ${comic.currentPage + 1}/${comic.pagesCount} 页</div>
                <div class="novel-book-actions">
                    <button class="novel-btn-sm rename-btn" type="button">改名</button>
                    <button class="novel-btn-sm del-btn" type="button">删除</button>
                </div>
            </div>
        `;

        const coverEl = item.querySelector('.novel-book-cover');
        
        if (isMobile) {
            let longPressTimer = null;
            let isLongPress = false;
            
            coverEl.addEventListener('touchstart', (e) => {
                isLongPress = false;
                longPressTimer = setTimeout(() => {
                    isLongPress = true;
                    e.preventDefault();
                    const touch = e.touches[0];
                    if (navigator.vibrate) navigator.vibrate(50);
                    openCoverEditMenu(comic.id, { 
                        clientX: touch.clientX, 
                        clientY: touch.clientY 
                    });
                }, 500);
            });
            
            coverEl.addEventListener('touchend', (e) => {
                if (longPressTimer) clearTimeout(longPressTimer);
                if (!isLongPress) {
                    openReader(comic.id);
                }
            });
            
            coverEl.addEventListener('touchmove', () => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            });
        } else {
            coverEl.onclick = () => openReader(comic.id);
            coverEl.oncontextmenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openCoverEditMenu(comic.id, e);
            };
        }
        
        item.querySelector('.novel-book-title').onclick = () => openReader(comic.id);
        
        item.querySelector('.novel-book-title').ondblclick = (e) => {
            e.stopPropagation();
            renameComic(comic.id);
        };
        item.querySelector('.rename-btn').onclick = (e) => {
            e.stopPropagation();
            renameComic(comic.id);
        };

        item.querySelector('.del-btn').onclick = async (e) => {
            e.stopPropagation();
            if (confirm(`确定要彻底删除《${comic.title}》吗？这将不可恢复！`)) {
                try {
                    await deleteComicPagesFromDB(comic.id);
                    state.comics = state.comics.filter(c => c.id !== comic.id);
                    if (state.settings.comicCovers && state.settings.comicCovers[comic.id]) {
                        delete state.settings.comicCovers[comic.id];
                    }
                    saveExtensionSettings();
                    renderShelf();
                } catch (err) {
                    handleError(err, '删除失败');
                }
            }
        };

        container.appendChild(item);
    });
}




function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getHashColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    ];
    return colors[Math.abs(hash) % colors.length];
}

// ==================== 阅读器 ====================
async function openReader(comicId) {
    const comic = state.comics.find(c => c.id === comicId);
    if (!comic) return;

    state.activeComicId = comicId;
    state.activePageIndex = comic.currentPage || 0;

    document.getElementById('novel-shelf-view').style.display = 'none';
    const readerView = document.getElementById('novel-reader-view');
    readerView.style.display = 'flex';

    await renderActivePage();
}

async function renderActivePage() {
    const comic = state.comics.find(c => c.id === state.activeComicId);
    if (!comic) return;

    try {
        const pageData = await getPageFromDB(state.activeComicId, state.activePageIndex);
        const contentBox = document.getElementById('novel-reader-content');
        const headerTitle = document.getElementById('novel-reader-chapter-title');

        if (!pageData) {
            contentBox.innerHTML = '<p class="novel-error">页面内容加载失败，已被移除或尚未就绪。</p>';
            return;
        }

        headerTitle.textContent = `${comic.title} - 第 ${state.activePageIndex + 1}/${comic.pagesCount} 页`;
        
        // 🔧 根据阅读模式渲染
        const readingMode = state.settings.readingMode || 'scroll';
        const fitMode = state.settings.fitMode || 'width';
        
        let imgStyle = '';
        switch (fitMode) {
            case 'width':
                imgStyle = 'max-width: 100%; height: auto; display: block; margin: 0 auto;';
                break;
            case 'height':
                imgStyle = 'width: auto; max-height: 100%; display: block; margin: 0 auto;';
                break;
            case 'original':
                imgStyle = 'max-width: none; max-height: none; display: block;';
                break;
        }

        if (readingMode === 'scroll') {
            // 滚动模式：显示当前页及相邻页面
            contentBox.innerHTML = '';
            contentBox.style.overflow = 'auto';
            contentBox.style.display = 'flex';
            contentBox.style.flexDirection = 'column';
            contentBox.style.alignItems = 'center';
            contentBox.style.gap = '20px';
            contentBox.style.padding = '20px';
            
            // 预加载前后各2页
            const startIdx = Math.max(0, state.activePageIndex - 1);
            const endIdx = Math.min(comic.pagesCount - 1, state.activePageIndex + 2);
            
            for (let i = startIdx; i <= endIdx; i++) {
                const page = await getPageFromDB(state.activeComicId, i);
                if (page) {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'comic-page-wrapper';
                    imgWrapper.setAttribute('data-page-index', i);
                    imgWrapper.style.cssText = 'width: 100%; display: flex; justify-content: center;';
                    
                    const img = document.createElement('img');
                    img.src = page.imageData;
                    img.alt = `第 ${i + 1} 页`;
                    img.style.cssText = imgStyle;
                    img.className = 'comic-page-image';
                    
                    // 🔧 修复：单击无反应，双击才放大
                    img.onclick = (e) => {
                        e.stopPropagation();  // 阻止冒泡到 readerContainer
                        // 单击不做任何操作
                    };
                    
                    img.ondblclick = (e) => {
                        e.stopPropagation();  // 阻止冒泡
                        if (fitMode === 'original') {
                            state.settings.fitMode = 'width';
                        } else {
                            state.settings.fitMode = 'original';
                        }
                        renderActivePage();
                    };
                    
                    imgWrapper.appendChild(img);
                    contentBox.appendChild(imgWrapper);
                }
            }
            
            // 🔧 修复：滚动到当前页顶部，而不是居中
            setTimeout(() => {
                const currentPageEl = contentBox.querySelector(`[data-page-index="${state.activePageIndex}"]`);
                if (currentPageEl) {
                    // 使用 scrollTop 精确控制，保持在顶部
                    contentBox.scrollTop = currentPageEl.offsetTop - 20;  // 减去 20px 作为顶部边距
                }
            }, 100);
            
        } else {
            // 翻页模式：只显示当前页
            contentBox.style.overflow = 'hidden';
            contentBox.style.display = 'flex';
            contentBox.style.alignItems = 'center';
            contentBox.style.justifyContent = 'center';
            contentBox.style.padding = '0';
            
            contentBox.innerHTML = `
                <div class="comic-page-container" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    <img src="${pageData.imageData}" 
                         style="${imgStyle}" 
                         class="comic-page-image" 
                         alt="第 ${state.activePageIndex + 1} 页">
                </div>
            `;
            
            // 🔧 修复：单击无反应，双击才切换适配模式
            const img = contentBox.querySelector('.comic-page-image');
            img.onclick = (e) => {
                e.stopPropagation();  // 阻止冒泡
                // 单击不做任何操作
            };
            
            img.ondblclick = (e) => {
                e.stopPropagation();  // 阻止冒泡
                if (fitMode === 'width') {
                    state.settings.fitMode = 'height';
                } else if (fitMode === 'height') {
                    state.settings.fitMode = 'original';
                } else {
                    state.settings.fitMode = 'width';
                }
                renderActivePage();
            };
        }

        comic.currentPage = state.activePageIndex;
        saveExtensionSettingsDebounced();
        applyReaderStyles();
    } catch (err) {
        handleError(err, '页面加载失败');
    }
}




function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function quitReader() {
    document.getElementById('novel-reader-view').style.display = 'none';
    document.getElementById('novel-reader-menu-overlay').classList.remove('active');
    document.getElementById('novel-shelf-view').style.display = 'flex';
    state.activeComicId = null;
    renderShelf();
}

function renameComic(comicId) {
    const comic = state.comics.find(c => c.id === comicId);
    if (!comic) return;
    const newName = prompt("请输入新名称:", comic.title);
    if (newName && newName.trim()) {
        comic.title = newName.trim();
        saveExtensionSettings();
        renderShelf();
    }
}

// ==================== 翻页控制 ====================
async function nextPage() {
    const comic = state.comics.find(c => c.id === state.activeComicId);
    if (!comic) return;
    
    const direction = state.settings.pageDirection || 'ltr';
    
    if (direction === 'rtl') {
        // 右到左（日漫）：右键是上一页
        if (state.activePageIndex > 0) {
            state.activePageIndex--;
            await renderActivePage();
        } else {
            alert('已经是第一页了！');
        }
    } else {
        // 左到右（普通）：右键是下一页
        if (state.activePageIndex < comic.pagesCount - 1) {
            state.activePageIndex++;
            await renderActivePage();
        } else {
            alert('已经是最后一页了！');
        }
    }
}

async function prevPage() {
    const comic = state.comics.find(c => c.id === state.activeComicId);
    if (!comic) return;
    
    const direction = state.settings.pageDirection || 'ltr';
    
    if (direction === 'rtl') {
        // 右到左（日漫）：左键是下一页
        if (state.activePageIndex < comic.pagesCount - 1) {
            state.activePageIndex++;
            await renderActivePage();
        } else {
            alert('已经是最后一页了！');
        }
    } else {
        // 左到右（普通）：左键是上一页
        if (state.activePageIndex > 0) {
            state.activePageIndex--;
            await renderActivePage();
        } else {
            alert('已经是第一页了！');
        }
    }
}

// ==================== 书籍封面编辑 ====================
function openCoverEditMenu(comicId, event) {
    const comic = state.comics.find(c => c.id === comicId);
    if (!comic) return;

    const oldMenu = document.getElementById('novel-cover-edit-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'novel-cover-edit-menu';
    menu.className = 'novel-context-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        z-index: 200001;
        background: var(--kp-bg);
        border: 2px solid var(--kp-border);
        border-radius: 10px;
        box-shadow: var(--kp-shadow);
        padding: 8px;
        min-width: 160px;
    `;
    menu.setAttribute('data-novel-theme', state.settings.theme);

    menu.innerHTML = `
        <div class="novel-menu-item-ctx" data-action="gradient">🎨 使用默认渐变</div>
        <div class="novel-menu-item-ctx" data-action="text">✏️ 自定义文字</div>
        <div class="novel-menu-item-ctx" data-action="image">🖼️ 上传封面图片</div>
    `;

    document.body.appendChild(menu);
    applyTheme();

    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);

    menu.querySelectorAll('.novel-menu-item-ctx').forEach(item => {
        item.onclick = async () => {
            const action = item.dataset.action;
            menu.remove();

            if (action === 'gradient') {
                delete state.settings.comicCovers[comicId];
                saveExtensionSettings();
                renderShelf();
            } else if (action === 'text') {
                const text = prompt('请输入封面文字或 Emoji（1-4个字符）:', '📚');
                if (text && text.trim()) {
                    state.settings.comicCovers[comicId] = { type: 'text', value: text.trim().substring(0, 4) };
                    saveExtensionSettings();
                    renderShelf();
                }
            } else if (action === 'image') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    if (!file.type.startsWith('image/')) {
                        alert('请选择图片文件！');
                        return;
                    }
                    
                    if (file.size > 5 * 1024 * 1024) {
                        alert('图片过大（超过 5MB）！\n请使用更小的图片。');
                        return;
                    }
                    
                    compressImage(file, 300, 400, 0.8, (compressedDataUrl) => {
                        state.settings.comicCovers[comicId] = { type: 'image', value: compressedDataUrl };
                        saveExtensionSettings();
                        renderShelf();
                    });
                };
                input.click();
            }
        };
    });
}



// ==================== 创建主面板 ====================
function createPanel() {
    if (document.getElementById('novel-player-extension-panel')) return;

    panelElement = document.createElement('div');
    panelElement.id = 'novel-player-extension-panel';
    panelElement.setAttribute('data-novel-theme', state.settings.theme);

    if (window.innerWidth <= 768) {
        const w = Math.min(window.innerWidth * 0.94, 500);
        const h = Math.min(window.innerHeight * 0.82, 700);
        panelElement.style.position = 'fixed';
        panelElement.style.width = w + 'px';
        panelElement.style.height = h + 'px';
        panelElement.style.left = (window.innerWidth - w) / 2 + 'px';
        panelElement.style.top = (window.innerHeight - h) / 2 + 'px';
        panelElement.classList.add('novel-mobile');
    } else {
        panelElement.style.position = 'fixed';
        panelElement.style.bottom = '80px';
        panelElement.style.right = '20px';
        panelElement.style.width = state.savedWidth;
        panelElement.style.height = state.savedHeight;
    }

    const themeEmoji = THEMES[state.settings.theme].emoji;

    panelElement.innerHTML = `
        <div class="novel-ext-header" id="novel-ext-header-drag">
            <span class="title">${themeEmoji} ComicReader ${themeEmoji}</span>
            <div class="novel-ext-controls">
                <button id="novel-ext-help-btn" class="novel-ext-btn" title="说明" type="button">?</button>
                <button id="novel-ext-settings-btn" class="novel-ext-btn" title="设置" type="button">⚙</button>
                <button id="novel-ext-close-btn" class="novel-ext-btn" title="猫耳悬浮" type="button">×</button>
            </div>
        </div>

        <div id="novel-ext-lower-wrapper">
            <div id="novel-shelf-view" class="novel-view-active">
                <div class="novel-shelf-header">
                    <div class="novel-search-row">
                        <input type="text" id="novel-search-input" placeholder="输入漫画名搜索 (高亮匹配)..." />
                        <button id="novel-toggle-layout" class="novel-action-btn-flat" title="切换列表/网格排列" type="button">⚃</button>
                    </div>
                    <div class="novel-import-row">
                        <input type="file" id="novel-file-picker" accept="image/*,.zip,.pdf" multiple style="display:none;" />
                        <button id="novel-import-btn" class="novel-pink-action-btn" type="button">导入漫画</button>
                        <button id="novel-backup-btn" class="novel-mint-action-btn" type="button">备份</button>
                        <input type="file" id="novel-backup-picker" accept=".json" style="display:none;" />
                        <button id="novel-restore-btn" class="novel-mint-action-btn" type="button">还原</button>
                    </div>
                </div>
                <div class="novel-shelf-body" id="novel-shelf-container"></div>
            </div>

            <div id="novel-reader-view" style="display: none;">
                <div id="novel-reader-container">
                    <div id="novel-reader-chapter-title"></div>
                    <div id="novel-reader-content"></div>
                </div>

                <div id="novel-reader-menu-overlay">
                    <div class="novel-reader-header-menu">
                        <button id="novel-menu-back-btn" class="novel-menu-item">↩ 退出</button>
                        <div style="flex:1;"></div>
                        <button id="novel-menu-mode-toggle" class="novel-menu-item">切换模式</button>
                    </div>
                    <div style="flex:1; pointer-events: none;"></div>
                    <div class="novel-reader-footer-menu">
                        <button id="novel-menu-prev" class="novel-menu-item">◀ 上一页</button>
                        <button id="novel-menu-toc" class="novel-menu-item">📖 目录</button>
                        <button id="novel-menu-next" class="novel-menu-item">下一页 ▶</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(panelElement);
    setupPanelEventDelegation();
    applyTheme();

    if (state.savedPos && state.savedPos.left != null && state.savedPos.top != null) {
        panelElement.style.left = state.savedPos.left + 'px';
        panelElement.style.top = state.savedPos.top + 'px';
        panelElement.style.right = 'auto';
        panelElement.style.bottom = 'auto';
    }

    renderShelf();
}

function setupPanelEventDelegation() {
    document.getElementById('novel-ext-close-btn').onclick = enterFloatingState;
    document.getElementById('novel-ext-settings-btn').onclick = openSettingsDialog;
    document.getElementById('novel-ext-help-btn').onclick = openHelpDialog;

    const searchInput = document.getElementById('novel-search-input');
    searchInput.oninput = (e) => {
        state.searchQuery = e.target.value;
        renderShelf();
    };

    document.getElementById('novel-toggle-layout').onclick = () => {
        state.settings.layoutMode = state.settings.layoutMode === 'list' ? 'grid' : 'list';
        saveExtensionSettings();
        renderShelf();
    };

    const filePicker = document.getElementById('novel-file-picker');
    document.getElementById('novel-import-btn').onclick = () => filePicker.click();
    filePicker.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            openImportConfigDialog(files);
            e.target.value = '';
        }
    };

    document.getElementById('novel-backup-btn').onclick = exportBackup;

    const backupPicker = document.getElementById('novel-backup-picker');
    document.getElementById('novel-restore-btn').onclick = () => backupPicker.click();
    backupPicker.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importBackup(file);
            e.target.value = '';
        }
    };

    // 🔧 修复：优化点击判断逻辑，点击图片不触发菜单
    const readerContainer = document.getElementById('novel-reader-container');
    readerContainer.onclick = (e) => {
        // 点击图片时不触发菜单
        if (e.target.classList.contains('comic-page-image')) {
            return;
        }
        
        // 点击空白区域唤醒菜单
        document.getElementById('novel-reader-menu-overlay').classList.add('active');
    };

    const menuOverlay = document.getElementById('novel-reader-menu-overlay');
    menuOverlay.onclick = (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    };

    document.getElementById('novel-menu-back-btn').onclick = quitReader;
    
    document.getElementById('novel-menu-prev').onclick = prevPage;
    document.getElementById('novel-menu-next').onclick = nextPage;

    document.getElementById('novel-menu-mode-toggle').onclick = () => {
        state.settings.readingMode = state.settings.readingMode === 'scroll' ? 'flip' : 'scroll';
        saveExtensionSettings();
        renderActivePage();
        menuOverlay.classList.remove('active');
    };

    document.getElementById('novel-menu-toc').onclick = () => {
        menuOverlay.classList.remove('active');
        openTocDialog();
    };

    // 🔧 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (!state.activeComicId) return;
        
        // 焦点在输入框时不响应快捷键
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            prevPage();
        } else if (e.key === 'Escape') {
            quitReader();
        }
    });

    // 🔧 新增：移动端左右滑动翻页
    let touchStartX = 0;
    let touchStartY = 0;
    const readerContent = document.getElementById('novel-reader-content');

    readerContent.addEventListener('touchstart', (e) => {
        if (!state.activeComicId) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    readerContent.addEventListener('touchend', (e) => {
        if (!state.activeComicId) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // 只有横向滑动距离大于纵向时才触发翻页（避免与滚动冲突）
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // 向左滑动 → 下一页
                nextPage();
            } else {
                // 向右滑动 → 上一页
                prevPage();
            }
        }
    });

    initDragSystem(panelElement, document.getElementById('novel-ext-header-drag'), false);
}

// ==================== PDF 文件处理（优化版） ====================
async function handlePdfImport(pdfFile) {
    try {
        // 动态加载 pdf.js
        if (typeof pdfjsLib === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = () => reject(new Error('pdf.js 库加载失败，请检查网络连接'));
            });
            
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        }

        const comicName = prompt('请输入漫画名称:', pdfFile.name.replace(/\.pdf$/i, ''));
        if (!comicName || !comicName.trim()) return;

        // 显示进度提示
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--kp-bg);
            border: 3px solid var(--kp-border);
            border-radius: 15px;
            padding: 20px 30px;
            z-index: 200001;
            text-align: center;
            box-shadow: var(--kp-shadow);
        `;
        progressDiv.innerHTML = `
            <div style="font-size: 14px; font-weight: bold; color: var(--kp-primary-deep); margin-bottom: 10px;">正在解析 PDF 文件...</div>
            <div id="import-progress-text" style="font-size: 12px; color: var(--kp-text);">请稍候...</div>
        `;
        document.body.appendChild(progressDiv);

        // 读取 PDF 文件
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;

        document.getElementById('import-progress-text').textContent = `共 ${totalPages} 页，开始渲染...`;

        const comicId = 'comic_' + Date.now();

        // 🔧 优化：根据页面尺寸动态计算 scale，限制最大宽度为 1200px
        const MAX_WIDTH = 1200;
        
        // 🔧 优化：分批并发处理（每批 3 页）
        const BATCH_SIZE = 3;
        
        for (let batchStart = 0; batchStart < totalPages; batchStart += BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + BATCH_SIZE, totalPages);
            const batchPromises = [];
            
            for (let i = batchStart; i < batchEnd; i++) {
                batchPromises.push(renderAndSavePage(pdf, i + 1, i, comicId));
            }
            
            await Promise.all(batchPromises);
            
            document.getElementById('import-progress-text').textContent = `渲染中：${batchEnd} / ${totalPages}`;
            
            // 让出主线程，避免界面卡死
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        // 渲染单页的内部函数
        async function renderAndSavePage(pdfDoc, pageNum, pageIndex, comicId) {
            const page = await pdfDoc.getPage(pageNum);
            const originalViewport = page.getViewport({ scale: 1 });
            
            // 动态计算 scale：确保宽度不超过 MAX_WIDTH
            const scale = Math.min(MAX_WIDTH / originalViewport.width, 1.5);
            const viewport = page.getViewport({ scale });

            // 每个并发任务用自己的 canvas（避免冲突）
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = viewport.width;
            pageCanvas.height = viewport.height;
            const pageCtx = pageCanvas.getContext('2d');

            await page.render({ canvasContext: pageCtx, viewport }).promise;

            // 🔧 优化：降低 JPEG 质量到 0.75，体积减少约 30%，视觉差异极小
            const base64 = pageCanvas.toDataURL('image/jpeg', 0.75);
            
            // 🔧 优化：直接用 canvas 缩放生成缩略图，不走 Image 加载
            const thumbSize = 200;
            const thumbRatio = Math.min(thumbSize / viewport.width, thumbSize / viewport.height);
            const tw = Math.floor(viewport.width * thumbRatio);
            const th = Math.floor(viewport.height * thumbRatio);
            
            const tCanvas = document.createElement('canvas');
            tCanvas.width = tw;
            tCanvas.height = th;
            const tCtx = tCanvas.getContext('2d');
            tCtx.drawImage(pageCanvas, 0, 0, tw, th);
            const thumbnail = tCanvas.toDataURL('image/jpeg', 0.6);

            await savePageToDB(comicId, pageIndex, base64, thumbnail);
            
            // 释放引用
            pageCanvas.width = 0;
            pageCanvas.height = 0;
            tCanvas.width = 0;
            tCanvas.height = 0;
        }

        // 检查是否已存在同名漫画
        const existingComic = state.comics.find(c => c.title === comicName.trim());
        if (existingComic) {
            await deleteComicPagesFromDB(existingComic.id);
            state.comics = state.comics.filter(c => c.id !== existingComic.id);
        }

        state.comics.push({
            id: comicId,
            title: comicName.trim(),
            pagesCount: totalPages,
            currentPage: 0,
            addedTime: Date.now()
        });

        saveExtensionSettings();
        renderShelf();

        progressDiv.remove();
        alert(`《${comicName}》成功导入！共 ${totalPages} 页。`);
    } catch (err) {
        const progressDiv = document.querySelector('[style*="z-index: 200001"]');
        if (progressDiv) progressDiv.remove();
        handleError(err, 'PDF 导入失败');
    }
    
}



// ==================== ZIP 文件处理（在 openImportConfigDialog 之前添加） ====================
async function handleZipImport(zipFile) {
    try {
        // 动态加载 JSZip
        if (typeof JSZip === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js';
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = () => reject(new Error('JSZip 库加载失败'));
            });
        }

        const comicName = prompt('请输入漫画名称:', zipFile.name.replace('.zip', ''));
        if (!comicName || !comicName.trim()) return;

        // 显示进度提示
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--kp-bg);
            border: 3px solid var(--kp-border);
            border-radius: 15px;
            padding: 20px 30px;
            z-index: 200001;
            text-align: center;
            box-shadow: var(--kp-shadow);
        `;
        progressDiv.innerHTML = `
            <div style="font-size: 14px; font-weight: bold; color: var(--kp-primary-deep); margin-bottom: 10px;">正在解压 ZIP 文件...</div>
            <div id="import-progress-text" style="font-size: 12px; color: var(--kp-text);">请稍候...</div>
        `;
        document.body.appendChild(progressDiv);

        // 解压 ZIP
        const zip = await JSZip.loadAsync(zipFile);
        const imageFiles = [];

        // 提取图片文件
        for (const [filename, file] of Object.entries(zip.files)) {
            if (!file.dir && /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename)) {
                const blob = await file.async('blob');
                imageFiles.push({
                    name: filename,
                    blob: blob,
                    file: new File([blob], filename, { type: `image/${filename.split('.').pop()}` })
                });
            }
        }

        if (imageFiles.length === 0) {
            progressDiv.remove();
            alert('ZIP 文件中没有找到图片！');
            return;
        }

        // 按文件名自然排序
        imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

        document.getElementById('import-progress-text').textContent = `找到 ${imageFiles.length} 张图片，开始导入...`;

        const comicId = 'comic_' + Date.now();

        // 批量处理图片
        for (let i = 0; i < imageFiles.length; i++) {
            const base64 = await imageToBase64(imageFiles[i].file);
            const thumbnail = await generateThumbnail(base64, 200);
            await savePageToDB(comicId, i, base64, thumbnail);
            
            document.getElementById('import-progress-text').textContent = `${i + 1} / ${imageFiles.length}`;
        }

        // 检查是否已存在同名漫画
        const existingComic = state.comics.find(c => c.title === comicName.trim());
        if (existingComic) {
            await deleteComicPagesFromDB(existingComic.id);
            state.comics = state.comics.filter(c => c.id !== existingComic.id);
        }

        state.comics.push({
            id: comicId,
            title: comicName.trim(),
            pagesCount: imageFiles.length,
            currentPage: 0,
            addedTime: Date.now()
        });

        saveExtensionSettings();
        renderShelf();
        
        progressDiv.remove();
        alert(`《${comicName}》成功导入！共 ${imageFiles.length} 页。`);
    } catch (err) {
        handleError(err, 'ZIP 导入失败');
    }
}

// ==================== 导入配置对话框 ====================
function openImportConfigDialog(files) {
    if (importConfigDialogElement) importConfigDialogElement.remove();

    // 🔧 检测是否为 ZIP 文件
    const isZip = files.length === 1 && (files[0].name.endsWith('.zip') || files[0].type === 'application/zip' || files[0].type === 'application/x-zip-compressed');

    if (isZip) {
        handleZipImport(files[0]);
        return;
    }

    // 🔧 检测是否为 PDF 文件
    const isPdf = files.length === 1 && (files[0].name.toLowerCase().endsWith('.pdf') || files[0].type === 'application/pdf');

    if (isPdf) {
        handlePdfImport(files[0]);
        return;
    }

    importConfigDialogElement = document.createElement('div');
    importConfigDialogElement.className = 'novel-dialog-mask';
    importConfigDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    importConfigDialogElement.innerHTML = `
        <div class="novel-dialog-box" style="width: 340px;">
            <div class="novel-dialog-header">
                <span>📂 导入设置：已选择 ${files.length} 张图片</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body">
                <div class="novel-section">
                    <label class="novel-label">漫画名称：</label>
                    <input type="text" id="novel-comic-name" class="novel-avatar-input" placeholder="请输入漫画名称" />
                </div>

                <div class="novel-section">
                    <label class="novel-label">图片排序：</label>
                    <select id="novel-sort-method" class="novel-settings-select">
                        <option value="name" selected>按文件名排序（自然排序）</option>
                        <option value="date">按修改时间排序</option>
                        <option value="size">按文件大小排序</option>
                    </select>
                </div>

                <div class="novel-settings-actions" style="margin-top:20px;">
                    <button id="novel-import-confirm" type="button" class="novel-action-btn-sm novel-action-btn-primary">开始导入</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(importConfigDialogElement);
    applyTheme();

    importConfigDialogElement.querySelector('.novel-dialog-close').onclick = () => importConfigDialogElement.remove();

    document.getElementById('novel-import-confirm').onclick = async () => {
        const comicName = document.getElementById('novel-comic-name').value.trim();
        const sortMethod = document.getElementById('novel-sort-method').value;

        if (!comicName) {
            alert('请输入漫画名称！');
            return;
        }

        importConfigDialogElement.remove();

        try {
            // 排序文件
            let sortedFiles = [...files];
            if (sortMethod === 'name') {
                sortedFiles.sort((a, b) => naturalSort(a, b));
            } else if (sortMethod === 'date') {
                sortedFiles.sort((a, b) => a.lastModified - b.lastModified);
            } else if (sortMethod === 'size') {
                sortedFiles.sort((a, b) => a.size - b.size);
            }

            const comicId = 'comic_' + Date.now();
            const totalPages = sortedFiles.length;

            // 显示进度提示
            const progressDiv = document.createElement('div');
            progressDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--kp-bg);
                border: 3px solid var(--kp-border);
                border-radius: 15px;
                padding: 20px 30px;
                z-index: 200001;
                text-align: center;
                box-shadow: var(--kp-shadow);
            `;
            progressDiv.innerHTML = `
                <div style="font-size: 14px; font-weight: bold; color: var(--kp-primary-deep); margin-bottom: 10px;">正在导入漫画...</div>
                <div id="import-progress-text" style="font-size: 12px; color: var(--kp-text);">0 / ${totalPages}</div>
            `;
            document.body.appendChild(progressDiv);

            // 批量处理图片
            for (let i = 0; i < sortedFiles.length; i++) {
                const file = sortedFiles[i];
                const base64 = await imageToBase64(file);
                const thumbnail = await generateThumbnail(base64, 200);
                await savePageToDB(comicId, i, base64, thumbnail);
                
                // 更新进度
                document.getElementById('import-progress-text').textContent = `${i + 1} / ${totalPages}`;
            }

            // 检查是否已存在同名漫画
            const existingComic = state.comics.find(c => c.title === comicName);
            if (existingComic) {
                try {
                    await deleteComicPagesFromDB(existingComic.id);
                    state.comics = state.comics.filter(c => c.id !== existingComic.id);
                    console.log(`已清理旧漫画数据: ${comicName}`);
                } catch (err) {
                    console.warn('清理旧漫画数据失败:', err);
                }
            }

            state.comics.push({
                id: comicId,
                title: comicName,
                pagesCount: totalPages,
                currentPage: 0,
                addedTime: Date.now()
            });

            saveExtensionSettings();
            renderShelf();
            
            progressDiv.remove();
            alert(`《${comicName}》成功导入！共 ${totalPages} 页。`);
        } catch (err) {
            handleError(err, '导入失败');
        }
    };
}



// ==================== 目录对话框（优化版） ====================
async function openTocDialog() {
    if (tocDialogElement) tocDialogElement.remove();

    const comic = state.comics.find(c => c.id === state.activeComicId);
    if (!comic) return;

    tocDialogElement = document.createElement('div');
    tocDialogElement.className = 'novel-dialog-mask';
    tocDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    tocDialogElement.innerHTML = `
        <div class="novel-dialog-box" style="width: 420px; max-height:80vh;">
            <div class="novel-dialog-header">
                <span>📖 缩略图目录 (${comic.pagesCount} 页)</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body" id="novel-toc-list-box" style="overflow-y:auto; flex:1; max-height: 60vh; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px;">
                <div style="grid-column: 1 / -1; text-align:center; padding:20px; color:var(--kp-text-muted);">加载中...</div>
            </div>
        </div>
    `;

    document.body.appendChild(tocDialogElement);
    applyTheme();
    
    tocDialogElement.querySelector('.novel-dialog-close').onclick = () => tocDialogElement.remove();

    const tocContainer = document.getElementById('novel-toc-list-box');
    
    // 分批渲染缩略图
    const batchSize = 12;
    
    tocContainer.innerHTML = '';
    
    for (let i = 0; i < comic.pagesCount; i += batchSize) {
        const fragment = document.createDocumentFragment();
        const end = Math.min(i + batchSize, comic.pagesCount);
        const batchItems = [];
        
        for (let j = i; j < end; j++) {
            const item = document.createElement('div');
            item.className = `novel-toc-thumb-item ${j === state.activePageIndex ? 'active' : ''}`;
            item.setAttribute('data-idx', j);
            item.style.cssText = `
                position: relative;
                aspect-ratio: 3/4;
                border: 2px solid ${j === state.activePageIndex ? 'var(--kp-primary-deep)' : 'var(--kp-border)'};
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                background: var(--kp-bg-soft);
                transition: all 0.2s ease;
            `;
            item.innerHTML = `
                <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--kp-text-muted); font-size: 10px;">
                    加载中...
                </div>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; text-align: center; font-size: 10px; padding: 2px;">
                    ${j + 1}
                </div>
            `;
            fragment.appendChild(item);
            batchItems.push({ element: item, index: j });
        }
        
        tocContainer.appendChild(fragment);
        
        // 异步加载缩略图
        Promise.all(
            batchItems.map(async ({ element, index }) => {
                try {
                    const pageData = await getPageFromDB(state.activeComicId, index);
                    const domItem = tocContainer.querySelector(`[data-idx="${index}"]`);
                    if (domItem && pageData) {
                        domItem.innerHTML = `
                            <img src="${pageData.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;" alt="第 ${index + 1} 页">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; text-align: center; font-size: 10px; padding: 2px;">
                                ${index + 1}
                            </div>
                        `;
                        domItem.onclick = async () => {
                            state.activePageIndex = index;
                            await renderActivePage();
                            tocDialogElement.remove();
                        };
                        domItem.onmouseenter = () => {
                            domItem.style.transform = 'scale(1.05)';
                            domItem.style.borderColor = 'var(--kp-primary)';
                        };
                        domItem.onmouseleave = () => {
                            if (index !== state.activePageIndex) {
                                domItem.style.transform = 'scale(1)';
                                domItem.style.borderColor = 'var(--kp-border)';
                            }
                        };
                    }
                } catch (err) {
                    console.warn(`加载页面 ${index} 缩略图失败:`, err);
                }
            })
        );
        
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    const activeItem = tocContainer.querySelector('.novel-toc-thumb-item.active');
    if (activeItem) {
        setTimeout(() => activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' }), 100);
    }
}

// ==================== 设置弹窗 ====================
function openSettingsDialog() {
    if (document.getElementById('novel-ext-settings-dialog')) {
        closeSettingsDialog();
        return;
    }

    settingsDialogElement = document.createElement('div');
    settingsDialogElement.id = 'novel-ext-settings-dialog';
    settingsDialogElement.className = 'novel-dialog-mask';
    settingsDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    settingsDialogElement.innerHTML = `
        <div class="novel-settings-box" data-novel-theme="${state.settings.theme}">
            <div class="novel-settings-header">
                <span>⚙ 主题与外观设置</span>
                <button class="novel-settings-close" type="button">×</button>
            </div>
            <div class="novel-settings-body">
                <div class="novel-settings-section">
                    <div class="novel-settings-label">🎨 主题配色</div>
                    <div class="novel-theme-grid">
                        ${Object.entries(THEMES).map(([key, info]) => `
                            <label class="novel-theme-option" data-theme-key="${key}">
                                <input type="radio" name="novel-theme" value="${key}" ${state.settings.theme === key ? 'checked' : ''}>
                                <div class="novel-theme-preview novel-theme-preview-${key}"></div>
                                <span>${info.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🖼️ 边框纹理图片</div>
                    <div class="novel-border-image-controls">
                        <div class="novel-border-image-upload-wrap">
                            <input type="file" id="novel-border-image-upload" accept="image/*" style="display:none;">
                            <button id="novel-border-image-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-primary">
                                ${state.settings.borderImage ? '✓ 已设置边框' : '📁 上传边框图'}
                            </button>
                        </div>
                        <div class="novel-border-image-mode-wrap">
                            <select id="novel-border-image-mode" class="novel-settings-select">
                                <option value="background" ${state.settings.borderImageMode === 'background' ? 'selected' : ''}>保留猫耳边框</option>
                                <option value="replace" ${state.settings.borderImageMode === 'replace' ? 'selected' : ''}>整片图片铺满</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🔘 悬浮球尺寸</div>
                    <div class="novel-size-options">
                        <label class="novel-size-option">
                            <input type="radio" name="novel-badge-size" value="large" ${state.settings.badgeSize === 'large' ? 'checked' : ''}>
                            <span>大（72px）</span>
                        </label>
                        <label class="novel-size-option">
                            <input type="radio" name="novel-badge-size" value="medium" ${state.settings.badgeSize === 'medium' ? 'checked' : ''}>
                            <span>中（58px）</span>
                        </label>
                        <label class="novel-size-option">
                            <input type="radio" name="novel-badge-size" value="small" ${state.settings.badgeSize === 'small' ? 'checked' : ''}>
                            <span>小（44px）</span>
                        </label>
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">🐱 悬浮球猫咪头像</div>
                    <div class="novel-avatar-type">
                        <label><input type="radio" name="novel-avatar-type" value="emoji" ${state.settings.avatarType === 'emoji' ? 'checked' : ''}> <span>Emoji/颜文字</span></label>
                        <label><input type="radio" name="novel-avatar-type" value="url" ${state.settings.avatarType === 'url' ? 'checked' : ''}> <span>网络图片</span></label>
                        <label><input type="radio" name="novel-avatar-type" value="upload" ${state.settings.avatarType === 'upload' ? 'checked' : ''}> <span>本地上传</span></label>
                    </div>
                    <div class="novel-avatar-input-wrap">
                        <input type="text" id="novel-avatar-emoji" class="novel-avatar-input" placeholder="输入一两个字符，如 🐾 或 🐱" value="${state.settings.avatarType === 'emoji' ? state.settings.avatarValue : ''}" style="display:${state.settings.avatarType === 'emoji' ? 'block' : 'none'}">
                        <input type="text" id="novel-avatar-url" class="novel-avatar-input" placeholder="http://..." value="${state.settings.avatarType === 'url' ? state.settings.avatarValue : ''}" style="display:${state.settings.avatarType === 'url' ? 'block' : 'none'}">
                        <div id="novel-avatar-upload-area" style="display:${state.settings.avatarType === 'upload' ? 'block' : 'none'}">
                            <input type="file" id="novel-avatar-upload-input" accept="image/*" style="display:none;">
                            <button id="novel-avatar-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-primary">
                                ${state.settings.avatarType === 'upload' && state.settings.avatarValue ? '✓ 已上传头像' : '📁 上传头像图片'}
                            </button>
                            ${state.settings.avatarType === 'upload' && state.settings.avatarValue ? '<div class="novel-avatar-preview"><img src="' + state.settings.avatarValue + '" alt="预览" style="width:48px;height:48px;border-radius:50%;margin-top:8px;object-fit:cover;border:2px solid var(--kp-primary);"></div>' : ''}
                        </div>
                    </div>
                </div>

                <div class="novel-settings-section">
                    <div class="novel-settings-label">📖 阅读器自定义</div>
                    
                    <div class="novel-reader-bg-controls" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">阅读背景图片</label>
                        <input type="file" id="novel-reader-bg-upload" accept="image/*" style="display:none;">
                        <button id="novel-reader-bg-upload-btn" type="button" class="novel-action-btn-sm novel-action-btn-secondary" style="width:100%;margin-bottom:8px;">
                            ${state.settings.readerBgImage ? '✓ 已设置背景' : '📁 上传阅读背景'}
                        </button>
                        ${state.settings.readerBgImage ? '<button id="novel-reader-bg-clear-btn" type="button" class="novel-action-btn-sm" style="width:100%;font-size:10px;">✕ 清除背景</button>' : ''}
                    </div>

                    <div class="novel-reader-opacity-control" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">背景透明度：<span id="novel-opacity-value">${Math.round(state.settings.readerBgOpacity * 100)}%</span></label>
                        <input type="range" id="novel-reader-opacity-slider" min="0" max="100" value="${state.settings.readerBgOpacity * 100}" style="width:100%;">
                    </div>

                    <div class="novel-reader-mode-controls" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">阅读模式</label>
                        <select id="novel-reading-mode" class="novel-settings-select">
                            <option value="scroll" ${state.settings.readingMode === 'scroll' ? 'selected' : ''}>滚动模式（连续浏览）</option>
                            <option value="flip" ${state.settings.readingMode === 'flip' ? 'selected' : ''}>翻页模式（单页切换）</option>
                        </select>
                    </div>

                    <div class="novel-reader-fit-controls" style="margin-bottom:12px;">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">图片适配</label>
                        <select id="novel-fit-mode" class="novel-settings-select">
                            <option value="width" ${state.settings.fitMode === 'width' ? 'selected' : ''}>适应宽度</option>
                            <option value="height" ${state.settings.fitMode === 'height' ? 'selected' : ''}>适应高度</option>
                            <option value="original" ${state.settings.fitMode === 'original' ? 'selected' : ''}>原始大小</option>
                        </select>
                    </div>

                    <div class="novel-reader-direction-controls">
                        <label style="font-size:10px;color:var(--kp-text-muted);display:block;margin-bottom:4px;">翻页方向</label>
                        <select id="novel-page-direction" class="novel-settings-select">
                            <option value="ltr" ${state.settings.pageDirection === 'ltr' ? 'selected' : ''}>从左到右（普通漫画）</option>
                            <option value="rtl" ${state.settings.pageDirection === 'rtl' ? 'selected' : ''}>从右到左（日本漫画）</option>
                        </select>
                    </div>
                </div>

                <div class="novel-settings-actions">
                    <button id="novel-settings-save" type="button" class="novel-action-btn-sm novel-action-btn-primary">保存设置</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(settingsDialogElement);
    applyTheme();
    setupSettingsEvents();
}


function setupSettingsEvents() {
    const dialog = settingsDialogElement;
    dialog.querySelector('.novel-settings-close').onclick = closeSettingsDialog;

    dialog.querySelectorAll('input[name="novel-theme"]').forEach(radio => {
        radio.onchange = (e) => {
            const selectedTheme = e.target.value;
            const colors = THEME_COLORS[selectedTheme] || THEME_COLORS.pink;
            
            dialog.setAttribute('data-novel-theme', selectedTheme);
            
            dialog.style.setProperty('--kp-primary', colors.primary);
            dialog.style.setProperty('--kp-primary-light', colors.primaryLight);
            dialog.style.setProperty('--kp-primary-deep', colors.primaryDeep);
            dialog.style.setProperty('--kp-secondary', colors.secondary);
            dialog.style.setProperty('--kp-bg', colors.bg);
            dialog.style.setProperty('--kp-bg-soft', colors.bgSoft);
            dialog.style.setProperty('--kp-text', colors.text);
            dialog.style.setProperty('--kp-text-muted', colors.textMuted);
            dialog.style.setProperty('--kp-border', colors.border);
            dialog.style.setProperty('--kp-action-primary', colors.actionPrimary);
            dialog.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
            dialog.style.setProperty('--kp-action-secondary', colors.actionSecondary);
            dialog.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
            dialog.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
        };
    });

    dialog.querySelectorAll('input[name="novel-avatar-type"]').forEach(radio => {
        radio.onchange = (e) => {
            const val = e.target.value;
            document.getElementById('novel-avatar-emoji').style.display = val === 'emoji' ? 'block' : 'none';
            document.getElementById('novel-avatar-url').style.display = val === 'url' ? 'block' : 'none';
            document.getElementById('novel-avatar-upload-area').style.display = val === 'upload' ? 'block' : 'none';
        };
    });

    const avatarUploadInput = document.getElementById('novel-avatar-upload-input');
    const avatarUploadBtn = document.getElementById('novel-avatar-upload-btn');
    if (avatarUploadBtn && avatarUploadInput) {
        avatarUploadBtn.onclick = () => avatarUploadInput.click();
        avatarUploadInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                state.settings.avatarValue = ev.target.result;
                avatarUploadBtn.textContent = '✓ 上传成功！';
                
                const previewArea = document.querySelector('.novel-avatar-preview');
                if (previewArea) previewArea.remove();
                const preview = document.createElement('div');
                preview.className = 'novel-avatar-preview';
                preview.innerHTML = '<img src="' + ev.target.result + '" alt="预览" style="width:48px;height:48px;border-radius:50%;margin-top:8px;object-fit:cover;border:2px solid var(--kp-primary);">';
                document.getElementById('novel-avatar-upload-area').appendChild(preview);
            };
            reader.readAsDataURL(file);
        };
    }

    const borderFile = document.getElementById('novel-border-image-upload');
    const borderBtn = document.getElementById('novel-border-image-upload-btn');
    borderBtn.onclick = () => borderFile.click();
    borderFile.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.settings.borderImage = ev.target.result;
            borderBtn.textContent = '✓ 上传成功！';
        };
        reader.readAsDataURL(file);
    };

    const readerBgUpload = document.getElementById('novel-reader-bg-upload');
    const readerBgUploadBtn = document.getElementById('novel-reader-bg-upload-btn');
    if (readerBgUploadBtn && readerBgUpload) {
        readerBgUploadBtn.onclick = () => readerBgUpload.click();
        readerBgUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                state.settings.readerBgImage = ev.target.result;
                readerBgUploadBtn.textContent = '✓ 上传成功！';
                setTimeout(() => {
                    closeSettingsDialog();
                    openSettingsDialog();
                }, 500);
            };
            reader.readAsDataURL(file);
        };
    }

    const readerBgClearBtn = document.getElementById('novel-reader-bg-clear-btn');
    if (readerBgClearBtn) {
        readerBgClearBtn.onclick = () => {
            state.settings.readerBgImage = '';
            closeSettingsDialog();
            openSettingsDialog();
        };
    }

    const opacitySlider = document.getElementById('novel-reader-opacity-slider');
    const opacityValue = document.getElementById('novel-opacity-value');
    if (opacitySlider && opacityValue) {
        opacitySlider.oninput = (e) => {
            const val = parseInt(e.target.value);
            opacityValue.textContent = val + '%';
            state.settings.readerBgOpacity = val / 100;
        };
    }

    document.getElementById('novel-settings-save').onclick = () => {
        const theme = dialog.querySelector('input[name="novel-theme"]:checked').value;
        const badgeSize = dialog.querySelector('input[name="novel-badge-size"]:checked').value;
        const avatarType = dialog.querySelector('input[name="novel-avatar-type"]:checked').value;
        let avatarVal = '';
        if (avatarType === 'emoji') {
            avatarVal = document.getElementById('novel-avatar-emoji').value.trim() || THEMES[theme].emoji;
        } else if (avatarType === 'url') {
            avatarVal = document.getElementById('novel-avatar-url').value.trim();
        } else if (avatarType === 'upload') {
            avatarVal = state.settings.avatarValue;
        }

        state.settings.theme = theme;
        state.settings.badgeSize = badgeSize;
        state.settings.avatarType = avatarType;
        state.settings.avatarValue = avatarVal;
        state.settings.borderImageMode = document.getElementById('novel-border-image-mode').value;
        
        state.settings.readingMode = document.getElementById('novel-reading-mode').value;
        state.settings.fitMode = document.getElementById('novel-fit-mode').value;
        state.settings.pageDirection = document.getElementById('novel-page-direction').value;

        applyTheme();
        applyReaderStyles();
        if (floatBadgeElement) {
            floatBadgeElement.setAttribute('data-size', badgeSize);
            updateBadgeAvatar();
        }
        saveExtensionSettings();
        closeSettingsDialog();
    };
}


function closeSettingsDialog() {
    if (settingsDialogElement) {
        settingsDialogElement.remove();
        settingsDialogElement = null;
    }
}

// ==================== 说明手册 ====================
function openHelpDialog() {
    if (helpDialogElement) {
        helpDialogElement.remove();
        helpDialogElement = null;
        return;
    }

    helpDialogElement = document.createElement('div');
    helpDialogElement.className = 'novel-dialog-mask';
    helpDialogElement.setAttribute('data-novel-theme', state.settings.theme);

    helpDialogElement.innerHTML = `
        <div class="novel-dialog-box" style="width: 420px; max-height:82vh;">
            <div class="novel-dialog-header">
                <span>📖 ComicReader完全指南</span>
                <button class="novel-dialog-close" type="button">×</button>
            </div>
            <div class="novel-dialog-body" style="font-size:12px; line-height:1.9; overflow-y:auto; max-height:70vh;">
                
                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:12px;">📚 快速开始</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li>首次使用点击侧边栏"唤醒漫画阅读器"按钮，或点击悬浮球打开面板</li>
                    <li>点击"导入图片"选择漫画图片文件（支持批量选择）</li>
                    <li>输入漫画名称，选择图片排序方式，点击"开始导入"</li>
                    <li>点击漫画封面即可开始沉浸式阅读</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">📚 漫画导入</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>导入方式：</b>点击"导入图片"按钮，批量选择漫画图片文件（支持 JPG、PNG、WebP、GIF 等格式）</li>
                    <li><b>排序方式：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>按文件名排序：自动识别数字顺序（如 page1, page2, page10 正确排序）</li>
                            <li>按修改时间排序：按文件最后修改时间排列</li>
                            <li>按文件大小排序：按文件体积从小到大排列</li>
                        </ul>
                    </li>
                    <li><b>进度显示：</b>导入过程中会显示实时进度（如 50 / 100），大量图片可能需要等待片刻</li>
                    <li><b>覆盖导入：</b>如果导入同名漫画，会自动清理旧数据并替换为新内容</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">📚 漫画管理</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>封面自定义：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>桌面端：右键点击漫画封面打开菜单</li>
                            <li>移动端：长按漫画封面（0.5秒触发，会有震动反馈）</li>
                            <li>可选择默认渐变色、自定义文字/Emoji、或上传封面图片</li>
                            <li>上传的封面图片会自动压缩优化，避免占用过多存储空间</li>
                        </ul>
                    </li>
                    <li><b>重命名：</b>点击"改名"按钮或双击漫画名称，输入新名称即可</li>
                    <li><b>删除漫画：</b>点击"删除"按钮会彻底移除漫画及所有页面数据（不可恢复，请谨慎操作）</li>
                    <li><b>搜索功能：</b>顶部搜索栏输入漫画名，匹配内容会高亮显示（黄色背景）</li>
                    <li><b>布局切换：</b>点击"⚃"按钮在列表视图和网格视图间切换（网格视图更适合漫画）</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">📖 阅读模式</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>滚动模式（推荐）：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>垂直滚动连续浏览多页漫画，适合长篇阅读</li>
                            <li>自动预加载当前页前后各2页，确保流畅体验</li>
                            <li>滚动到某页时会自动更新阅读进度</li>
                            <li>点击图片可在"适应宽度"和"原始大小"间切换（适合查看细节）</li>
                        </ul>
                    </li>
                    <li><b>翻页模式：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>单页显示，通过左右箭头键或点击按钮翻页</li>
                            <li>适合需要专注单页内容的场景</li>
                            <li>点击图片可循环切换"适应宽度"→"适应高度"→"原始大小"</li>
                        </ul>
                    </li>
                    <li><b>模式切换：</b>点击阅读区域中央唤醒菜单，点击"切换模式"按钮即可在两种模式间切换</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">🎮 阅读器操作</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>唤醒菜单：</b>点击阅读区域中央（避开图片），弹出顶部/底部操作菜单</li>
                    <li><b>翻页操作：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>点击"◀ 上一页"/"下一页 ▶"按钮翻页</li>
                            <li>键盘快捷键：← 或 A 键上一页，→ 或 D 键下一页</li>
                            <li>支持日漫阅读方向（右到左），在设置中切换</li>
                        </ul>
                    </li>
                    <li><b>缩略图目录：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>点击"📖 目录"打开缩略图网格，3列布局快速浏览</li>
                            <li>当前阅读页会高亮显示（带彩色边框）</li>
                            <li>点击任意缩略图即可跳转到对应页面</li>
                            <li>缩略图分批加载，大量页面也不会卡顿</li>
                        </ul>
                    </li>
                    <li><b>退出阅读：</b>点击"↩ 退出"返回书架，阅读进度会自动保存</li>
                    <li><b>快捷键 ESC：</b>快速退出阅读器返回书架</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">🎨 主题与外观</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>主题配色：</b>提供 10 种精美主题
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>樱花粉、嫩黄、淡绿：清新明亮，适合白天阅读</li>
                            <li>毛玻璃白/黑：半透明效果，时尚美观</li>
                            <li>夜樱、深海蓝、摩卡棕：深色主题，护眼夜读</li>
                            <li>落日橘、薰衣草：温暖柔和，舒适体验</li>
                        </ul>
                    </li>
                    <li><b>边框纹理：</b>上传图片作为面板边框装饰
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>保留猫耳边框：图片作为背景，保留原有边框样式</li>
                            <li>整片铺满：图片完全覆盖边框区域，个性化更强</li>
                        </ul>
                    </li>
                    <li><b>悬浮球尺寸：</b>大（72px）、中（58px）、小（44px）三档调节，适配不同屏幕</li>
                    <li><b>悬浮球头像：</b>支持 Emoji/颜文字、网络图片链接、本地图片上传三种方式自定义</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">🖌️ 阅读器自定义</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>阅读背景：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>上传自定义背景图片（风景、纹理、壁纸等）</li>
                            <li>通过透明度滑块调节（0-100%），半透明遮罩确保图片清晰可见</li>
                            <li>营造独特的阅读氛围，让漫画阅读更有沉浸感</li>
                        </ul>
                    </li>
                    <li><b>图片适配：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>适应宽度：图片宽度填满屏幕，高度自适应（默认推荐）</li>
                            <li>适应高度：图片高度填满屏幕，宽度自适应（适合竖版漫画）</li>
                            <li>原始大小：显示图片原始尺寸，可滚动查看（适合高清大图）</li>
                        </ul>
                    </li>
                    <li><b>翻页方向：</b>
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>从左到右（普通漫画）：→ 键下一页，← 键上一页</li>
                            <li>从右到左（日本漫画）：→ 键上一页，← 键下一页（符合日漫习惯）</li>
                        </ul>
                    </li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">💾 备份与还原</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>备份：</b>点击"备份"按钮导出 JSON 文件
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>包含所有漫画、页面图片数据（Base64 格式）和阅读进度</li>
                            <li>文件名格式：📚ComicReader备份_2026-06-22.json</li>
                            <li>备份文件较大（取决于漫画数量），建议定期备份</li>
                        </ul>
                    </li>
                    <li><b>还原：</b>点击"还原"选择备份文件，自动恢复数据
                        <ul style="margin:4px 0 0 0; padding-left:18px; font-size:11px;">
                            <li>支持跨设备迁移（从电脑备份，手机还原）</li>
                            <li>还原过程会显示进度，大量数据需要耐心等待</li>
                            <li>不会覆盖现有数据，只添加备份中的新漫画</li>
                        </ul>
                    </li>
                    <li><b>数据安全：</b>使用 IndexedDB 本地存储，浏览器清理缓存前请务必备份，否则数据会永久丢失</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">💡 实用技巧</p>
                <ul style="margin:0 0 8px 0; padding-left:20px;">
                    <li><b>拖拽功能：</b>拖拽面板头部或悬浮球可自由移动位置，方便调整到舒适位置</li>
                    <li><b>面板大小：</b>桌面端面板右下角可调整大小（移动端自适应，无需调整）</li>
                    <li><b>图片命名：</b>导入前建议给图片命名为 page001.jpg、page002.jpg 格式，确保正确排序</li>
                    <li><b>大量图片：</b>目录支持分批加载，即使上百页漫画也不会卡顿</li>
                    <li><b>深色主题：</b>夜樱/毛玻璃黑/摩卡棕自动优化对比度，夜间阅读更护眼</li>
                    <li><b>性能优化：</b>图片会自动压缩（保持清晰度），缩略图另外生成，节省存储空间</li>
                    <li><b>移动端体验：</b>触摸滚动流畅，长按封面编辑，左右滑动翻页（需在翻页模式）</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">⚠️ 注意事项</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li>浏览器存储限制：IndexedDB 通常有几百 MB 到几 GB 的存储空间，具体取决于浏览器和设备</li>
                    <li>图片质量：建议使用适中分辨率图片（1000-2000px 宽度），过大会占用大量空间</li>
                    <li>定期备份：重装浏览器、清理缓存、更换设备前务必先导出备份</li>
                    <li>隐私保护：所有数据存储在本地浏览器，不会上传到任何服务器</li>
                    <li>兼容性：推荐使用 Chrome、Edge、Firefox 等现代浏览器，IE 不支持</li>
                </ul>

                <p style="font-weight:bold; color:var(--kp-primary-deep); font-size:14px; margin-bottom:8px;">🔧 常见问题</p>
                <ul style="margin:0 0 16px 0; padding-left:20px;">
                    <li><b>Q：导入图片后顺序乱了怎么办？</b><br>A：使用"按文件名排序"并确保文件名包含数字（如 001、002），系统会自动识别自然排序</li>
                    <li><b>Q：漫画太多导致卡顿？</b><br>A：尝试删除不常看的漫画，或使用网格视图（加载更快）</li>
                    <li><b>Q：图片显示不全？</b><br>A：切换图片适配模式（设置中调整），或点击图片切换查看模式</li>
                    <li><b>Q：如何在手机和电脑间同步？</b><br>A：在原设备导出备份，发送到新设备后导入即可</li>
                    <li><b>Q：误删了漫画怎么办？</b><br>A：如果有备份文件，可以通过"还原"功能恢复；否则无法找回</li>
                </ul>

                <p style="text-align:center; margin-top:20px; padding-top:16px; border-top:1px dashed var(--kp-border); color:var(--kp-text-muted); font-size:10px;">
                    📚 ComicReader v1.0.0<br>
                    支持滚动/翻页双模式、自定义主题、缩略图目录<br>
                    祝您阅读愉快！
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(helpDialogElement);
    applyTheme();
    
    helpDialogElement.querySelector('.novel-dialog-close').onclick = () => {
        helpDialogElement.remove();
        helpDialogElement = null;
    };
}



// ==================== 拖拽系统 ====================
function initDragSystem(panel, handle, isBadge) {
    if (!handle) return;
    let isDragging = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let moveHandler = null;
    let endHandler = null;
    const DRAG_THRESHOLD = 5;

    const start = (clientX, clientY, e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            return false;
        }
        isDragging = true;
        hasMoved = false;
        if (isBadge) panel.dataset.dragging = 'true';
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startX = clientX;
        startY = clientY;

        panel.style.left = startLeft + 'px';
        panel.style.top = startTop + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.classList.add('novel-is-dragging');
        return true;
    };

    const move = (clientX, clientY) => {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        if (!hasMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
            hasMoved = true;
        }
        if (!hasMoved) return;
        panel.style.left = (startLeft + dx) + 'px';
        panel.style.top = (startTop + dy) + 'px';
    };

    const end = () => {
        if (!isDragging) return;
        const wasMoved = hasMoved;
        isDragging = false;
        hasMoved = false;
        panel.classList.remove('novel-is-dragging');
        if (moveHandler) {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('touchmove', moveHandler);
            moveHandler = null;
        }
        if (endHandler) {
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchend', endHandler);
            endHandler = null;
        }
        if (isBadge) {
            if (wasMoved) {
                panel.dataset.dragging = 'true';
                setTimeout(() => { if (floatBadgeElement) panel.dataset.dragging = 'false'; }, 100);
                saveExtensionSettings();
            } else {
                panel.dataset.dragging = 'false';
            }
        } else {
            saveExtensionSettings();
        }
    };

    handle.addEventListener('mousedown', (e) => {
        if (!start(e.clientX, e.clientY, e)) return;
        moveHandler = (ev) => move(ev.clientX, ev.clientY);
        endHandler = () => end();
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
    });

    handle.addEventListener('touchstart', (e) => {
        if (!e.touches[0]) return;
        if (!start(e.touches[0].clientX, e.touches[0].clientY, e)) return;
        moveHandler = (ev) => { if (ev.touches[0]) move(ev.touches[0].clientX, ev.touches[0].clientY); };
        endHandler = () => end();
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);
    }, { passive: false });
}


// ==================== 悬浮状态 ====================
function enterFloatingState() {
    state.isFloating = true;
    let badgeLeft = null, badgeTop = null;
    if (panelElement) {
        const rect = panelElement.getBoundingClientRect();
        state.savedPos = { left: rect.left, top: rect.top };
        const dim = BADGE_DIMENSIONS[state.settings.badgeSize] || BADGE_DIMENSIONS.medium;
        badgeLeft = rect.left + rect.width / 2 - dim.w / 2;
        badgeTop = rect.top + rect.height / 2 - dim.h / 2;
        panelElement.style.display = 'none';
    }
    createFloatBadge(badgeLeft, badgeTop);
    saveExtensionSettings();
}

function exitFloatingState() {
    state.isFloating = false;
    if (floatBadgeElement) floatBadgeElement.style.display = 'none';
    panelElement.style.display = 'flex';
    renderShelf();
    saveExtensionSettings();
}

function createFloatBadge(customLeft = null, customTop = null) {
    if (document.getElementById('novel-ext-float-badge')) {
        floatBadgeElement.style.display = 'block';
        return;
    }

    floatBadgeElement = document.createElement('div');
    floatBadgeElement.id = 'novel-ext-float-badge';
    floatBadgeElement.dataset.dragging = 'false';
    floatBadgeElement.setAttribute('data-size', state.settings.badgeSize);
    floatBadgeElement.setAttribute('data-novel-theme', state.settings.theme);

    const isMobile = window.innerWidth <= 768;
    const left = customLeft !== null ? customLeft + 'px' : (isMobile ? '15px' : '40px');
    const top = customTop !== null ? customTop + 'px' : '40%';

    floatBadgeElement.style.cssText = `
        position: fixed !important;
        left: ${left} !important;
        top: ${top} !important;
        z-index: 100000 !important;
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
    `;

    floatBadgeElement.innerHTML = `
        <div class="novel-badge-container">
            <div class="novel-badge-ear left"></div>
            <div class="novel-badge-ear right"></div>
            <div class="novel-badge-circle">
                <div class="novel-badge-text-face"></div>
            </div>
        </div>
    `;

    document.body.appendChild(floatBadgeElement);
    applyTheme();

    let downX = 0, downY = 0, downTime = 0;
    const onDown = (x, y) => { downX = x; downY = y; downTime = Date.now(); };
    const onUp = (x, y) => {
        const dx = Math.abs(x - downX);
        const dy = Math.abs(y - downY);
        const dt = Date.now() - downTime;
        if (dx < 10 && dy < 10 && dt < 500) {
            exitFloatingState();
        }
    };

    floatBadgeElement.addEventListener('touchstart', (e) => {
        if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
    });
    floatBadgeElement.addEventListener('touchend', (e) => {
        if (e.changedTouches[0]) onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });
    floatBadgeElement.addEventListener('mousedown', (e) => { if (e.button === 0) onDown(e.clientX, e.clientY); });
    floatBadgeElement.addEventListener('mouseup', (e) => { if (e.button === 0) onUp(e.clientX, e.clientY); });

    initDragSystem(floatBadgeElement, floatBadgeElement, true);
}

function toggleMainPanel() {
    if (state.isFloating) {
        exitFloatingState();
    } else if (panelElement) {
        panelElement.style.display = panelElement.style.display === 'none' ? 'flex' : 'none';
    } else {
        createPanel();
    }
}

// ==================== 初始化 ====================
async function initExtension() {
    try {
        await initIndexedDB();
        loadExtensionSettings();

        if (state.settings.startAsFloating) {
            createPanel();
            panelElement.style.display = 'none';
            applyTheme();
            state.isFloating = true;
            createFloatBadge();
        } else {
            createPanel();
            applyTheme();
        }

        let attempts = 0;
        const injectInterval = setInterval(() => {
            attempts++;
            const menu = document.getElementById('extensions_settings');
            if (menu && !document.getElementById('novel-ext-nav-toggle')) {
                menu.insertAdjacentHTML('afterbegin', `
                    <div class="inline-drawer" id="novel-ext-nav-toggle" style="margin-bottom: 10px; cursor: pointer; padding: 10px; background: var(--kp-primary-light, #fff0f3); border-radius: 10px; border: 2px dashed var(--kp-primary, #ff85a7); text-align: center; color: var(--kp-primary-deep, #fb7299); font-weight: bold; transition: all 0.2s ease;">
                        <span>📚 唤醒漫画阅读器 📚</span>
                    </div>
                `);
                
                const toggleBtn = document.getElementById('novel-ext-nav-toggle');
                toggleBtn.onclick = toggleMainPanel;
                
                toggleBtn.onmouseenter = () => {
                    toggleBtn.style.background = 'var(--kp-primary, #ff85a7)';
                    toggleBtn.style.color = 'var(--kp-bg, #ffffff)';
                    toggleBtn.style.transform = 'scale(1.02)';
                };
                toggleBtn.onmouseleave = () => {
                    toggleBtn.style.background = 'var(--kp-primary-light, #fff0f3)';
                    toggleBtn.style.color = 'var(--kp-primary-deep, #fb7299)';
                    toggleBtn.style.transform = 'scale(1)';
                };
            }
            if (document.getElementById('novel-ext-nav-toggle') || attempts > 20) {
                clearInterval(injectInterval);
            }
        }, 1000);
    } catch (err) {
        handleError(err, '插件初始化失败');
    }
}



if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initExtension();
} else {
    document.addEventListener('DOMContentLoaded', initExtension);
}
