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
        
        // Re-add event handlers after showing the day content
        setTimeout(() => {
            this.addLocationCardClickHandlers();
            this.addGoogleMapsHandlers();
        }, 100);
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
        const cards = document.querySelectorAll('.location-card');
        
        cards.forEach((card, index) => {
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
        // Get custom map URL if available, otherwise use default
        const customUrl = this.getCustomMapUrl(location);
        const mapUrl = customUrl || this.getDefaultMapUrl(location);
        
        // Open in new tab
        window.open(mapUrl, '_blank');
        
        // Show a toast notification
        this.showToast(`正在開啟 ${location} 的 Google 地圖...`);
    }

    getDefaultMapUrl(location) {
        // Default Google Maps URL with the location
        const encodedLocation = encodeURIComponent(location + ' 台灣');
        return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    }

    getCustomMapUrl(location) {
        // Custom map URLs for more accurate locations
        // You can edit these URLs directly in the code
        const customUrls = {
            '桃園國際機場': 'https://www.google.com/maps/place/桃園國際機場/@25.0800,121.2320,15z',
            '桃園高鐵站': 'https://maps.app.goo.gl/q8p6v7RHVEzBHhHe9',
            '台中火車站附近住宿': 'https://maps.app.goo.gl/64sajYpZWjWfmnH68',
            '審計新村368新創聚落': 'https://maps.app.goo.gl/29RmB3QhyiybaQSi7',
            '高美濕地': 'https://www.google.com/maps/place/高美濕地/@24.3110,120.5490,15z',
            '逢甲夜市': 'https://maps.app.goo.gl/FtHW8kgx59mnT4Yh6',
            '彩虹眷村': 'https://maps.app.goo.gl/5qWuvXVEebzcRecE7',
            '宮原眼科': 'https://maps.app.goo.gl/7KXkuZ9bsWXe38rK6',
            '台中高鐵站': 'https://maps.app.goo.gl/hQdEYa4hFvbTEMqt6',
            "台北airbnb住宿":'https://maps.app.goo.gl/64sajYpZWjWfmnH68',
            '龍洞潛水': 'https://www.google.com/maps/place/龍洞灣海洋公園/@25.0970,121.9210,15z',
            '龍洞浮潛': 'https://www.google.com/maps/place/龍洞灣海洋公園/@25.0970,121.9210,15z',
            '九份老街': 'https://maps.app.goo.gl/sNoWjYqyu61dMDEi9',
            '十分車站': 'https://maps.app.goo.gl/R88jPU4WyzaGLtm37',
            '關渡碼頭貨櫃市集': 'https://maps.app.goo.gl/GLAX53GXVAuGrUaWA',
            '饒河街觀光夜市': 'https://maps.app.goo.gl/UYwoUr7xEtgRZXQM7',
            '華山1914文創園區': 'https://maps.app.goo.gl/q3fofPxfUxPjSEWy8',
            '西門町': 'https://www.google.com/maps/place/西門町/@25.0420,121.5080,16z',
            '寧夏夜市': 'https://maps.app.goo.gl/uKugKLnNLUschvMAA',
            '小巨蛋Roller186溜輪場': 'https://maps.app.goo.gl/okKU2UVVnPysENVv9',
            '信義區購物': 'https://maps.app.goo.gl/ErNX3G5GmQJHyN9M6',
            '台北101': 'https://maps.app.goo.gl/kgUiFTBVSN3WNih88'
        };
        
        // If no location specified, return all custom URLs
        if (!location) {
            return customUrls;
        }
        
        // Return custom URL if available, otherwise return null
        return customUrls[location] || null;
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
        const locationDuration = card.querySelector('.location-duration').textContent;
        const locationDescription = card.querySelector('.location-description').textContent;
        const locationImage = card.querySelector('.location-image img').src;

        // Populate modal content
        document.getElementById('modalTitle').textContent = locationName;
        document.getElementById('modalTime').textContent = locationDuration; // Use duration as time
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
        
        // Add detailed description to the new section
        document.getElementById('modalDetailedDescription').innerHTML = details.detailedDescription || '';

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    getLocationDetails(locationName) {
        // Detailed information for each location with comprehensive descriptions
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
                bestTime: '23:21 - 23:59',
                transport: '高鐵',
                ticket: '約NT$ 700-900',
                notes: '乘坐 23:21 班次（車號 0567）'
            },
            '台中住宿': {
                stayTime: '住宿2晚',
                bestTime: '晚上',
                transport: '計程車、公車',
                ticket: '-',
                notes: '13/8 16:00 - 15/8 11:00 \\ 入住人：Wong Tsz Suen \\ 14-15 早餐 \\ 訂單號 454163753721'
            },
            '審計新村368新創聚落': {
                stayTime: '2-3小時',
                bestTime: '開放時間：11:30-20:30',
                transport: '台中市西區民生路368巷2弄12號',
                ticket: '免費',
                notes: '萬年不敗台中打卡景點，集結台中市集、美食還有滿滿文創小物',
                detailedDescription: '<h4>歷史沿革</h4><p>1969年落成，原為臺灣省政府審計處職員宿舍，採英式花園城市概念配置前庭後院，雨污分流在當年堪稱前衛。1998年「精省」後荒廢；2015年市府「摘星青年、築夢台中」計畫導入60餘組創業團隊，活化為文創市集。</p><h4>建築特色</h4><p>二層黃牆、磨石子地與木窗保留1960年代眷舍風味；每日11:00-22:00市集與咖啡廳輪番營業。小蝸牛市集每週末開張。</p><h4>必拍景點</h4><p>鵝黃牆＋木窗老宅、巷底浮雕「Shenji 368」LOGO。</p>'
            },
            '高美濕地': {
                stayTime: '2-3小時',
                bestTime: '黃昏時分（5-7點）',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '注意潮汐時間，建議查詢日落時間',
                detailedDescription: '<h4>歷史變遷</h4><p>前身為1932年開放的高美海水浴場；因臺中港北岸沙堤造成淤積，1976年閉園後轉為濕地。2004年公告為野生動物保護區，2014年修建691m木棧道，夕陽與風車構成「台版天空之鏡」。</p><h4>生態特色</h4><p>栖有瀕危雲林莞草與彈塗魚及冬季黑面琵鷺；進入核心區受限，需循棧道觀察生態。</p><h4>最佳時機</h4><p>夕陽最佳拍攝4-9月18:00-19:00；漲潮前1.5小時棧道關閉。</p>'
            },
            '逢甲夜市': {
                stayTime: '2-3小時',
                bestTime: '晚上6-11點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '人潮眾多，注意隨身物品',
                detailedDescription: '<h4>發展歷程</h4><p>1963年逢甲大學遷入後，文華路旁眷村攤販聚集成夜市。1980年代台中經濟起飛擴張至福星路，現有攤商2,200家；2010年獲觀光局評選「台灣最美味夜市」。2014年年人潮1,220萬、營業額101億台幣。</p><h4>特色亮點</h4><p>創意小吃：起司馬鈴薯、巨無霸臭豆腐等。管理特色：垃圾不落地與隔音牆美化。平日3萬、假日逾10萬人次。</p>'
            },
            '彩虹眷村': {
                stayTime: '1-1.5小時',
                bestTime: '上午9-11點或下午3-5點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '拍照時注意不要觸摸彩繪牆面',
                detailedDescription: '<h4>藝術起源</h4><p>干城六村退伍榮民黃永阜自2008年起在牆面作畫，「彩虹爺爺」之名不脛而走。2010年學生發起「919搶救彩虹村」行動，市府以公園都市計畫保留；年遊客破百萬。2019年入選Lonely Planet《Secret Wonders of the World》。</p><h4>現況</h4><p>2024年黃永阜辭世，市府設紀念專區，園區續由志工與藝術家共創，維護街角童趣彩繪。</p>'
            },
            '宮原眼科': {
                stayTime: '1-2小時',
                bestTime: '上午10-12點或下午2-4點',
                transport: '公車、計程車',
                ticket: '免費參觀，冰淇淋需付費',
                notes: '冰淇淋很受歡迎，可能需要排隊',
                detailedDescription: '<h4>歷史建築</h4><p>紅磚騎樓建於1920年代；日本眼科博士宮原武熊1927年開設診所，日治時期台中最大眼科。融合羅馬拱廊與日式木構，戰後歷經衛生院、商號與921地震損毀；2012年日出集團修復為書牆式冰淇淋名店。</p><h4>建築特色</h4><p>保留拱窗與挑高天井，Low-E玻璃屋頂引自然光，哈利波特式書櫃為打卡熱點。必拍：挑高天井、二十字交趾陶店牌。</p>'
            },
            '前往台北': {
                stayTime: '40分鐘',
                bestTime: '全天',
                transport: '高鐵',
                ticket: '約NT$ 700-900',
                notes: '建議提前購買車票'
            },
            '台北airbnb': {
                stayTime: '住宿一晚',
                bestTime: '晚上',
                transport: '捷運、公車、計程車',
                ticket: 'NT$ 2,000-4,000/晚',
                notes: '建議選擇捷運站附近住宿，交通便利'
            },
            '龍洞潛水': {
                stayTime: '2-3小時',
                bestTime: '上午9-11點',
                transport: '包車、計程車',
                ticket: 'NT$ 1,500-2,500/人',
                notes: '需要預約，建議有潛水經驗',
                detailedDescription: '<h4>地理特色</h4><p>龍洞灣為3500萬年前沉積岩海蝕灣；清代稱「撈洞」。天然海灣阻流、能見度15-25m，1995年交通部成立風景區管理處，規劃台灣最早合法開放水域。</p><h4>活動項目</h4><p>提供浮潛、AIDA自由潛與岩壁攀登；攀岩場自1978年開發，九大區逾600條路線，YDS5.4-5.14a。夏季需預約教練並留意東北季風浪況，避開東北季風10-3月。</p>'
            },
            '龍洞浮潛': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-4點',
                transport: '包車、計程車',
                ticket: 'NT$ 800-1,200/人',
                notes: '適合初學者，提供裝備租借',
                detailedDescription: '<h4>地理特色</h4><p>龍洞灣為3500萬年前沉積岩海蝕灣；清代稱「撈洞」。天然海灣阻流、能見度15-25m，1995年交通部成立風景區管理處，規劃台灣最早合法開放水域。</p><h4>活動項目</h4><p>提供浮潛、AIDA自由潛與岩壁攀登；攀岩場自1978年開發，九大區逾600條路線，YDS5.4-5.14a。夏季需預約教練並留意東北季風浪況，避開東北季風10-3月。</p>'
            },
            '九份老街': {
                stayTime: '3-4小時',
                bestTime: '下午3-7點',
                transport: '公車、計程車',
                ticket: '免費',
                notes: '夜晚燈籠點亮時最美，建議傍晚前往',
                detailedDescription: '<h4>黃金歲月</h4><p>清光緒19年（1893）發現砂金，日治時期成「亞洲金都」，人口一度破10萬。1971年礦坑封閉後蕭條；1989年《悲情城市》取景帶動觀光復甦。</p><h4>景觀特色</h4><p>基山街、豎崎路石階與茶樓燈籠夜景成經典；夜色紅燈籠與山海景致最受攝影師青睞。建議平日傍晚前上山避開車潮，假日15:00前入山較順行。</p>'
            },
            '十分車站': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-4點',
                transport: '平溪線火車',
                ticket: '火車票NT$ 50-100，天燈NT$ 150-200',
                notes: '放天燈時注意安全，遵守規定',
                detailedDescription: '<h4>歷史背景</h4><p>平溪線1929年為運煤支線，木造十分站保存日式月台。天燈源自清道光年間「報平安火筒」；元宵節與觀光團體全年可施放，店家提供四色／八色書寫祈願。</p><h4>天燈文化</h4><p>年度高潮為元宵「平溪天燈節」，CNN評為全球必訪節慶。平時06-22時可施放，雨天改水燈更環保。環保提醒：竹架紙燈須至回收站換禮物。</p>'
            },
            '關渡碼頭貨櫃市集': {
                stayTime: '2-3小時',
                bestTime: '下午3-7點',
                transport: '捷運關渡站、公車',
                ticket: '免費',
                notes: '新開幕景點，河岸景色優美，適合看夕陽',
                detailedDescription: '<h4>活化專案</h4><p>北投關渡棧橋活化專案，2024-05-21開幕14座美食貨櫃，引進地下化水電設施。轉型14櫃異國美食＋河畔舞台。</p><h4>景觀特色</h4><p>夕陽對望關渡大橋，可串聯自行車道與客船往返大稻埕；夕陽對望觀音山與大橋；週末有駐唱、泡泡秀。可租單車串連關渡自然公園。</p>'
            },
            '饒河街觀光夜市': {
                stayTime: '1.5-2小時',
                bestTime: '晚上6-10點',
                transport: '捷運松山站、公車',
                ticket: '免費',
                notes: '有多家米其林推薦美食，建議空腹前往',
                detailedDescription: '<h4>歷史背景</h4><p>原為錫口河港商路；1987年社區與市府合作成立全長600m夜市，作為松山經濟活化方案。松山錫口河港老街，1987年居民與市府合作成觀光夜市。</p><h4>特色美食</h4><p>牌樓貓頭鷹雕像為地標，胡椒餅、藥燉排骨列米其林必比登推薦；招牌胡椒餅、藥燉排骨列米其林必比登；入口貓頭鷹銅像乃吉祥物。</p>'
            },
            '華山1914文創園區': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-5點',
                transport: '捷運忠孝新生站、公車',
                ticket: '免費參觀，展覽需付費',
                notes: '經常舉辦展覽，建議查詢最新活動',
                detailedDescription: '<h4>歷史變遷</h4><p>1914年日人創辦「芳釀社」清酒廠；1930年增建樟腦精製廠。1987年酒廠遷林口後閒置；1999年劇團搶救舊倉庫，2005年正式定位為台灣首座文創園區。</p><h4>文創發展</h4><p>1999年藝術家佔領掀起「華山運動」，2007年BOT由台灣文創公司營運，迄今辦展近3萬場。紅磚倉庫、酒槽鋼架與高塔成熱門展演場與週末手作市集；紅磚六合院、酒槽鋼架成IG打卡點。</p>'
            },
            '西門町': {
                stayTime: '2-3小時',
                bestTime: '下午2-8點',
                transport: '捷運西門站',
                ticket: '免費',
                notes: '年輕人聚集地，潮流時尚購物區',
                detailedDescription: '<h4>發展歷程</h4><p>1896年興建「東京亭」戲院，1922年正式命名西門町。1920年代成台北電影街，全盛37家戲院。1960-80年代電影街、八角樓紅樓推動流行文化；捷運板南線1999年通車帶動再生。</p><h4>現代風貌</h4><p>今日徒步區為青少年亞文化中心，集合動漫周邊、潮牌與街頭表演。推薦路線：紅樓 → 電影主題公園 → 武昌街手繪看板。</p>'
            },
            '寧夏夜市': {
                stayTime: '1.5-2小時',
                bestTime: '晚上6-10點',
                transport: '捷運雙連站、公車',
                ticket: '免費',
                notes: '曾獲選台北最好逛夜市，必吃蚵仔煎',
                detailedDescription: '<h4>歷史淵源</h4><p>源於1908年圓環攤販；圓環火災後寧夏路逆勢崛起。源自1908年建成圓環攤販，戰後擴展寧夏路。</p><h4>管理特色</h4><p>全長300m、180攤，首創「千歲宴」與行動支付；2020-24連獲經濟部五星市集。2014起推「環保夜市」地下油脂截流器，連續五年獲經濟部五星市集。</p>'
            },
            '小巨蛋Roller186溜輪場': {
                stayTime: '2-3小時',
                bestTime: '上午10-12點或下午2-5點',
                transport: '捷運小巨蛋站',
                ticket: 'NT$ 200-300/人',
                notes: '提供裝備租借，適合全家活動',
                detailedDescription: '<h4>設施介紹</h4><p>大魯閣集團2023-07-01進駐台北小巨蛋1F，450坪太空主題場地，可容300人。復刻70-80年代冰宮四輪滑輪文化，設DJ Show、互動光軌與新手練習區。</p><h4>活動特色</h4><p>450坪「迷幻太空」主題，容納300人，週末DJ Show。票價280元起，另租鞋護具100元。</p>'
            },
            '信義區購物': {
                stayTime: '2-3小時',
                bestTime: '下午2-8點',
                transport: '捷運市政府站、信義安和站',
                ticket: '免費',
                notes: '台北最繁華商業區，有大型購物中心',
                detailedDescription: '<h4>都市規劃</h4><p>信義計畫區原四四兵工廠，1970年代副都心規劃，1980年起大規模都市設計導入人車分流。1980年副都心都市設計導入人車分流。</p><h4>商業特色</h4><p>台北最繁華商業區，有大型購物中心。</p>'
            },
            '台北101': {
                stayTime: '2-3小時',
                bestTime: '下午4-8點',
                transport: '捷運台北101站',
                ticket: '觀景台NT$ 600/人',
                notes: '台灣地標建築，附近有購物中心',
                detailedDescription: '<h4>建築奇蹟</h4><p>信義計畫區原四四兵工廠，1970年代副都心規劃，1980年起大規模都市設計導入人車分流。2004年台北101高508m竣工，亞洲首棟100+層超高樓；2004年完工、高508m的台北101為全球首座500+m綠建築。</p><h4>結構特色</h4><p>結構含660t阻尼球、防17級颱風與7級地震；核心結構為660t風阻尼球(87-92F)可減震40%。觀景台：89F室內、91F戶外；101F秘境花園2020起開放。</p><h4>商業活動</h4><p>商圈百貨五大體系環繞市府廣場，10-11月周年慶為台灣零售最熱檔期。年跨年煙火長達300s為年度盛事。</p>'
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