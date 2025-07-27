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