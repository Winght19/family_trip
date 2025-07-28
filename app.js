// 台灣旅行行程表 JavaScript

class TravelItinerary {
    constructor() {
        this.currentDay = 0;
        this.dateButtons = document.querySelectorAll('.date-btn');
        this.dayContents = document.querySelectorAll('.day-content');
        this.init();
    }

    init() {
        this.bindEvents();
        this.addTaiwanDecoration();
        this.addScrollEffects();
        this.initModal(); // Initialize modal functionality
        this.showDay(0); // 預設顯示第一天
    }

    bindEvents() {
        // 日期按鈕點擊事件
        this.dateButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDay(index);
                this.updateActiveButton(index);
                this.scrollToTop();
            });
        });

        // 鍵盤導航支援
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && this.currentDay > 0) {
                this.showDay(this.currentDay - 1);
                this.updateActiveButton(this.currentDay - 1);
            } else if (e.key === 'ArrowRight' && this.currentDay < this.dateButtons.length - 1) {
                this.showDay(this.currentDay + 1);
                this.updateActiveButton(this.currentDay + 1);
            }
        });

        // 觸摸滑動支援
        this.addTouchSupport();

        // 滾動效果
        window.addEventListener('scroll', () => {
            this.handleScrollEffects();
        });

        // 圖片懶載入
        this.setupLazyLoading();
    }

    showDay(dayIndex) {
        // 隱藏所有日期內容
        this.dayContents.forEach((content, index) => {
            if (index === dayIndex) {
                content.classList.add('active');
                // 添加入場動畫
                this.animateLocationCards(content);
            } else {
                content.classList.remove('active');
            }
        });

        this.currentDay = dayIndex;
        
        // 更新頁面標題
        this.updatePageTitle(dayIndex);
    }

    updateActiveButton(dayIndex) {
        this.dateButtons.forEach((button, index) => {
            if (index === dayIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    updatePageTitle(dayIndex) {
        const dayData = this.getDayData(dayIndex);
        if (dayData) {
            document.title = `${dayData.date} - ${dayData.theme} | 台灣8月旅行行程表`;
        }
    }

    getDayData(dayIndex) {
        const dayTitles = [
            { date: '8月13日', theme: '抵達台中' },
            { date: '8月14日', theme: '台中市區文創與自然' },
            { date: '8月15日', theme: '台中經典景點' },
            { date: '8月16日', theme: '台北北海岸之旅' },
            { date: '8月17日', theme: '平溪線與古街探索' },
            { date: '8月18日', theme: '台北文化創意' },
            { date: '8月19日', theme: '信義區現代都會' }
        ];
        return dayTitles[dayIndex];
    }

    scrollToTop() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    animateLocationCards(dayContent) {
        const cards = dayContent.querySelectorAll('.location-card');
        cards.forEach((card, index) => {
            // 重置動畫
            card.style.animation = 'none';
            card.offsetHeight; // 觸發重排
            card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s forwards`;
        });
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let threshold = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;

            let diffX = startX - endX;
            let diffY = startY - endY;

            // 確保是水平滑動且超過閾值
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0 && this.currentDay < this.dateButtons.length - 1) {
                    // 向左滑動，顯示下一天
                    this.showDay(this.currentDay + 1);
                    this.updateActiveButton(this.currentDay + 1);
                } else if (diffX < 0 && this.currentDay > 0) {
                    // 向右滑動，顯示上一天
                    this.showDay(this.currentDay - 1);
                    this.updateActiveButton(this.currentDay - 1);
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    addTaiwanDecoration() {
        // 添加台灣形狀裝飾元素
        const decoration = document.createElement('div');
        decoration.className = 'taiwan-decoration';
        document.body.appendChild(decoration);
    }

    handleScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.header');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }

        // 為進入視窗的卡片添加動畫
        const cards = document.querySelectorAll('.location-card');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardVisible = 150;

            if (cardTop < window.innerHeight - cardVisible) {
                card.classList.add('animate');
            }
        });
    }

    addScrollEffects() {
        // 創建 Intersection Observer 用於滾動動畫
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // 觀察所有地點卡片
        document.querySelectorAll('.location-card').forEach(card => {
            observer.observe(card);
        });
    }

    setupLazyLoading() {
        // 圖片懶載入
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.location-image img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 新增方法：平滑滾動到特定元素
    smoothScrollTo(element) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }

    // 新增方法：添加收藏功能
    addFavoriteFeature() {
        document.querySelectorAll('.location-card').forEach(card => {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.innerHTML = '♡';
            favoriteBtn.title = '加入收藏';
            
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                favoriteBtn.classList.toggle('active');
                favoriteBtn.innerHTML = favoriteBtn.classList.contains('active') ? '♥' : '♡';
                
                // 可以在這裡添加收藏到 localStorage 的邏輯
                const locationName = card.querySelector('.location-name').textContent;
                this.toggleFavorite(locationName, favoriteBtn.classList.contains('active'));
            });

            card.querySelector('.location-info').appendChild(favoriteBtn);
        });
    }

    toggleFavorite(locationName, isFavorite) {
        // 由於不能使用 localStorage，這裡只做視覺反饋
        console.log(`${locationName} ${isFavorite ? '已加入' : '已移除'}收藏`);
        
        // 添加提示動畫
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = `${locationName} ${isFavorite ? '已加入收藏' : '已移除收藏'}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // 新增方法：搜尋功能
    addSearchFeature() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" class="search-input" placeholder="搜尋景點..." />
            <button class="search-clear">×</button>
        `;

        const dateNav = document.querySelector('.date-nav-container');
        dateNav.appendChild(searchContainer);

        const searchInput = searchContainer.querySelector('.search-input');
        const clearBtn = searchContainer.querySelector('.search-clear');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
            clearBtn.style.display = e.target.value ? 'block' : 'none';
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
            clearBtn.style.display = 'none';
            searchInput.focus();
        });
    }

    handleSearch(query) {
        const allCards = document.querySelectorAll('.location-card');
        const lowerQuery = query.toLowerCase();

        allCards.forEach(card => {
            const locationName = card.querySelector('.location-name').textContent.toLowerCase();
            const description = card.querySelector('.location-description').textContent.toLowerCase();
            
            if (locationName.includes(lowerQuery) || description.includes(lowerQuery)) {
                card.style.display = 'block';
                // 高亮搜尋結果
                if (query) {
                    card.classList.add('search-highlight');
                } else {
                    card.classList.remove('search-highlight');
                }
            } else {
                card.style.display = query ? 'none' : 'block';
                card.classList.remove('search-highlight');
            }
        });
    }

    // Modal functionality
    initModal() {
        this.modal = document.getElementById('locationModal');
        this.modalClose = document.getElementById('modalClose');
        
        // Close modal when clicking close button
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Add click handlers to all location cards
        this.addLocationCardClickHandlers();
        
        // Add Google Maps button handlers
        this.addGoogleMapsHandlers();
    }

    addLocationCardClickHandlers() {
        document.querySelectorAll('.location-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on favorite button or map button
                if (e.target.closest('.favorite-btn') || e.target.closest('.location-map-btn')) {
                    return;
                }
                this.openModal(card);
            });
        });
    }

    addGoogleMapsHandlers() {
        document.querySelectorAll('.location-map-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal from opening
                const location = btn.getAttribute('data-location');
                this.openGoogleMaps(location);
            });
        });
    }

    openGoogleMaps(location) {
        // Create Google Maps URL with the location
        const encodedLocation = encodeURIComponent(location + ' 台灣');
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
        
        // Open in new tab
        window.open(googleMapsUrl, '_blank');
        
        // Show a toast notification
        this.showToast(`正在開啟 ${location} 的 Google 地圖...`);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast map-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }

    openModal(card) {
        const locationName = card.querySelector('.location-name').textContent;
        const locationTime = card.querySelector('.location-time').textContent;
        const locationDuration = card.querySelector('.location-duration').textContent;
        const locationDescription = card.querySelector('.location-description').textContent;
        const locationImage = card.querySelector('.location-image img').src;

        // Populate modal content
        document.getElementById('modalTitle').textContent = locationName;
        document.getElementById('modalTime').textContent = locationTime;
        document.getElementById('modalDuration').textContent = locationDuration;
        document.getElementById('modalDescription').textContent = locationDescription;
        document.getElementById('modalImage').src = locationImage;
        document.getElementById('modalImage').alt = locationName;

        // Get detailed information based on location
        const details = this.getLocationDetails(locationName);
        document.getElementById('modalStayTime').textContent = details.stayTime;
        document.getElementById('modalBestTime').textContent = details.bestTime;
        document.getElementById('modalTransport').textContent = details.transport;
        document.getElementById('modalTicket').textContent = details.ticket;
        document.getElementById('modalNotes').textContent = details.notes;

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    getLocationDetails(locationName) {
        // Detailed information for each location
        const details = {
            '桃園國際機場': {
                stayTime: '30-60分鐘',
                bestTime: '全天24小時',
                transport: '機場捷運、計程車、機場巴士',
                ticket: '免費',
                notes: '建議提前2小時抵達機場辦理登機手續'
            },
            '桃園機場到台中高鐵': {
                stayTime: '40分鐘',
                bestTime: '全天',
                transport: '高鐵',
                ticket: '約NT$ 700-900',
                notes: '建議提前購買車票，可使用悠遊卡'
            },
            '台中住宿': {
                stayTime: '住宿一晚',
                bestTime: '晚上',
                transport: '計程車、公車',
                ticket: 'NT$ 1,500-3,000/晚',
                notes: '建議選擇市中心飯店，交通便利'
            },
            '審計新村368新創聚落': {
                stayTime: '2-3小時',
                bestTime: '下午2-6點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '週末有暮暮市集，建議週末前往'
            },
            '高美濕地': {
                stayTime: '2-3小時',
                bestTime: '黃昏時分（5-7點）',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '注意潮汐時間，建議查詢日落時間'
            },
            '逢甲夜市': {
                stayTime: '2-3小時',
                bestTime: '晚上6-11點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '人潮眾多，注意隨身物品'
            },
            '彩虹眷村': {
                stayTime: '1-1.5小時',
                bestTime: '上午9-11點或下午3-5點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '拍照時注意不要觸摸彩繪牆面'
            },
            '宮原眼科': {
                stayTime: '1-2小時',
                bestTime: '上午10-12點或下午2-4點',
                transport: '公車、計程車',
                ticket: '免費參觀，冰淇淋需付費',
                notes: '冰淇淋很受歡迎，可能需要排隊'
            },
            '前往台北': {
                stayTime: '40分鐘',
                bestTime: '全天',
                transport: '高鐵',
                ticket: '約NT$ 700-900',
                notes: '建議提前購買車票'
            },
            '龍洞潛水': {
                stayTime: '2-3小時',
                bestTime: '上午9-11點',
                transport: '包車、計程車',
                ticket: 'NT$ 1,500-2,500/人',
                notes: '需要預約，建議有潛水經驗'
            },
            '龍洞浮潛': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-4點',
                transport: '包車、計程車',
                ticket: 'NT$ 800-1,200/人',
                notes: '適合初學者，提供裝備租借'
            },
            '九份老街': {
                stayTime: '3-4小時',
                bestTime: '下午3-7點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '夜晚燈籠點亮時最美，建議傍晚前往'
            },
            '十分車站': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-4點',
                transport: '平溪線火車',
                ticket: '火車票NT$ 50-100，天燈NT$ 150-200',
                notes: '放天燈時注意安全，遵守規定'
            },
            '關渡碼頭貨櫃市集': {
                stayTime: '2-3小時',
                bestTime: '下午3-7點',
                transport: '捷運關渡站、公車',
                ticket: '免費',
                notes: '新開幕景點，河岸景色優美，適合看夕陽'
            },
            '饒河街觀光夜市': {
                stayTime: '1.5-2小時',
                bestTime: '晚上6-10點',
                transport: '捷運松山站、公車',
                ticket: '免費',
                notes: '有多家米其林推薦美食，建議空腹前往'
            },
            '華山1914文創園區': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-5點',
                transport: '捷運忠孝新生站、公車',
                ticket: '免費參觀，展覽需付費',
                notes: '經常舉辦展覽，建議查詢最新活動'
            },
            '西門町': {
                stayTime: '2-3小時',
                bestTime: '下午2-8點',
                transport: '捷運西門站',
                ticket: '免費',
                notes: '年輕人聚集地，潮流時尚購物區'
            },
            '寧夏夜市': {
                stayTime: '1.5-2小時',
                bestTime: '晚上6-10點',
                transport: '捷運雙連站、公車',
                ticket: '免費',
                notes: '曾獲選台北最好逛夜市，必吃蚵仔煎'
            },
            '小巨蛋Roller186溜輪場': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-5點',
                transport: '捷運小巨蛋站',
                ticket: 'NT$ 200-300/人',
                notes: '提供裝備租借，適合全家活動'
            },
            '信義區購物': {
                stayTime: '2-3小時',
                bestTime: '下午2-8點',
                transport: '捷運市政府站、信義安和站',
                ticket: '免費',
                notes: '台北最繁華商業區，有大型購物中心'
            },
            '台北101': {
                stayTime: '2-3小時',
                bestTime: '下午4-8點',
                transport: '捷運台北101站',
                ticket: '觀景台NT$ 600/人',
                notes: '台灣地標建築，附近有購物中心'
            }
        };

        return details[locationName] || {
            stayTime: '1-2小時',
            bestTime: '上午10-12點或下午2-5點',
            transport: '公車、計程車',
            ticket: '免費',
            notes: '請查詢最新資訊'
        };
    }
}

// 等 DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    const app = new TravelItinerary();
    
    // 添加額外功能
    setTimeout(() => {
        app.addFavoriteFeature();
        app.addSearchFeature();
    }, 1000);

    // 添加頁面載入完成的提示
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // 添加歡迎訊息
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'toast welcome-toast';
        welcomeToast.innerHTML = `
            <span>🇹🇼</span>
            <span>歡迎來到台灣旅行行程表！</span>
        `;
        document.body.appendChild(welcomeToast);

        setTimeout(() => {
            welcomeToast.classList.add('show');
        }, 500);

        setTimeout(() => {
            welcomeToast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(welcomeToast)) {
                    document.body.removeChild(welcomeToast);
                }
            }, 300);
        }, 3500);
    });
});

// 添加全局樣式到頁面
const additionalStyles = `
<style>
.favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 18px;
    color: #ccc;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.favorite-btn:hover {
    color: #ff6b6b;
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
}

.favorite-btn.active {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.location-card {
    position: relative;
}

.toast {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--color-primary);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(350px);
    transition: transform 0.3s ease;
    z-index: 1000;
    font-size: 14px;
    max-width: 300px;
}

.toast.show {
    transform: translateX(0);
}

.welcome-toast {
    background: linear-gradient(135deg, #FF8C42 0%, #FFD23F 100%);
    display: flex;
    align-items: center;
    gap: 8px;
}

.welcome-toast span:first-child {
    font-size: 20px;
}

.search-container {
    position: relative;
    max-width: 300px;
    margin: 10px 0;
}

.search-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 20px;
    font-size: 14px;
    background: var(--color-surface);
    color: var(--color-text);
}

.search-clear {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    display: none;
    color: var(--color-text-secondary);
    font-size: 18px;
}

.search-highlight {
    border-color: var(--color-taiwan-yellow) !important;
    box-shadow: 0 0 0 2px rgba(255, 210, 63, 0.3) !important;
}

@media (max-width: 768px) {
    .search-container {
        max-width: 100%;
    }
    
    .toast {
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .favorite-btn {
        width: 35px;
        height: 35px;
        font-size: 16px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);