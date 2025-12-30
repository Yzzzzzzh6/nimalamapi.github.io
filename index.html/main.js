// 全局变量
let rescueMap;
let rescueChart;
let rescueTypeChart;
let storiesSlider;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeFloatingHearts();
    initializeScrollReveal();
    initializeRescueMap();
    initializeCharts();
    initializeStoriesSlider();
    initializeCounters();
    initializeStationsList();
});

// 初始化动画效果
function initializeAnimations() {
    // Hero标题动画
    anime({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 300
    });
    
    // 卡片悬停动画
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// 初始化飘动爱心效果
function initializeFloatingHearts() {
    const container = document.getElementById('hearts-container');
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1';
        
        container.appendChild(heart);
        
        anime({
            targets: heart,
            translateY: -window.innerHeight - 100,
            translateX: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 360,
            opacity: [heart.style.opacity, 0],
            duration: Math.random() * 3000 + 5000,
            easing: 'linear',
            complete: function() {
                container.removeChild(heart);
            }
        });
    }
    
    // 定期创建爱心
    setInterval(createHeart, 2000);
}

// 初始化滚动显示效果
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 800,
                    easing: 'easeOutExpo'
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// 初始化救助地图
function initializeRescueMap() {
    // 北京坐标作为中心点
    rescueMap = L.map('rescue-map').setView([39.9042, 116.4074], 10);
    
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(rescueMap);
    
    // 救助站点数据
    const stations = [
        {
            name: '北京爱犬救助中心',
            lat: 39.9042,
            lng: 116.4074,
            address: '北京市朝阳区',
            phone: '010-12345678',
            dogs: 45,
            capacity: 80
        },
        {
            name: '北京流浪动物救助站',
            lat: 39.9388,
            lng: 116.3974,
            address: '北京市海淀区',
            phone: '010-87654321',
            dogs: 32,
            capacity: 60
        },
        {
            name: '北京宠物救助联盟',
            lat: 39.8563,
            lng: 116.3770,
            address: '北京市丰台区',
            phone: '010-56781234',
            dogs: 28,
            capacity: 50
        },
        {
            name: '北京动物保护中心',
            lat: 39.8722,
            lng: 116.4074,
            address: '北京市东城区',
            phone: '010-43218765',
            dogs: 56,
            capacity: 100
        },
        {
            name: '北京西城救助站',
            lat: 39.9139,
            lng: 116.3668,
            address: '北京市西城区',
            phone: '010-98765432',
            dogs: 19,
            capacity: 40
        }
    ];
    
    // 添加标记点
    stations.forEach(station => {
        const marker = L.marker([station.lat, station.lng]).addTo(rescueMap);
        
        const popupContent = `
            <div class="p-4 max-w-xs">
                <h3 class="font-bold text-lg mb-2">${station.name}</h3>
                <p class="text-gray-600 mb-2">📍 ${station.address}</p>
                <p class="text-gray-600 mb-2">📞 ${station.phone}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm">当前收容: ${station.dogs}只</span>
                    <span class="text-sm">容量: ${station.capacity}只</span>
                </div>
                <div class="mt-3">
                    <button class="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors" onclick="showStationDetails('${station.name}')">
                        查看详情
                    </button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// 初始化图表
function initializeCharts() {
    // 月度救助趋势图
    rescueChart = echarts.init(document.getElementById('rescue-chart'));
    
    const rescueOption = {
        color: ['#D2691E', '#8B4513', '#228B22'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['救助数量', '领养数量', '医疗救治']
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '救助数量',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
                smooth: true
            },
            {
                name: '领养数量',
                type: 'line',
                data: [80, 95, 75, 98, 65, 180, 165, 145, 152, 188, 235, 280],
                smooth: true
            },
            {
                name: '医疗救治',
                type: 'line',
                data: [95, 110, 85, 115, 75, 195, 180, 160, 168, 205, 255, 305],
                smooth: true
            }
        ]
    };
    
    rescueChart.setOption(rescueOption);
    
    // 救助类型分布图
    rescueTypeChart = echarts.init(document.getElementById('rescue-type-chart'));
    
    const rescueTypeOption = {
        color: ['#D2691E', '#8B4513', '#228B22', '#CD853F', '#DEB887'],
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '救助类型',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 35, name: '街头救助' },
                    { value: 25, name: '弃养接收' },
                    { value: 20, name: '医疗救治' },
                    { value: 12, name: '领养服务' },
                    { value: 8, name: '其他服务' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
    rescueTypeChart.setOption(rescueTypeOption);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        rescueChart.resize();
        rescueTypeChart.resize();
    });
}

// 初始化故事轮播
function initializeStoriesSlider() {
    storiesSlider = new Splide('#stories-slider', {
        type: 'loop',
        perPage: 1,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        breakpoints: {
            768: {
                perPage: 1
            }
        }
    });
    
    storiesSlider.mount();
}

// 初始化数字计数器动画
function initializeCounters() {
    const counters = [
        { id: 'rescued-count', target: 12580, duration: 2000 },
        { id: 'adopted-count', target: 8920, duration: 2000 },
        { id: 'treated-count', target: 15340, duration: 2000 },
        { id: 'volunteer-count', target: 3250, duration: 2000 },
        { id: 'donation-count', target: 2.8, duration: 2000, suffix: 'M' }
    ];
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = counters.find(c => c.id === entry.target.id);
                if (counter) {
                    animateCounter(counter);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) {
            observer.observe(element);
        }
    });
}

// 数字计数动画
function animateCounter(counter) {
    const element = document.getElementById(counter.id);
    const isDecimal = counter.target % 1 !== 0;
    
    anime({
        targets: { count: 0 },
        count: counter.target,
        duration: counter.duration,
        easing: 'easeOutExpo',
        update: function(anim) {
            const value = anim.animatables[0].target.count;
            if (isDecimal) {
                element.textContent = value.toFixed(1) + (counter.suffix || '');
            } else {
                element.textContent = Math.floor(value).toLocaleString();
            }
        }
    });
}

// 初始化救助站列表
function initializeStationsList() {
    const stationsContainer = document.getElementById('nearby-stations');
    
    const stations = [
        {
            name: '北京爱犬救助中心',
            address: '北京市朝阳区',
            distance: '2.3km',
            dogs: 45,
            capacity: 80
        },
        {
            name: '北京流浪动物救助站',
            address: '北京市海淀区',
            distance: '3.1km',
            dogs: 32,
            capacity: 60
        },
        {
            name: '北京宠物救助联盟',
            address: '北京市丰台区',
            distance: '4.5km',
            dogs: 28,
            capacity: 50
        },
        {
            name: '北京动物保护中心',
            address: '北京市东城区',
            distance: '5.2km',
            dogs: 56,
            capacity: 100
        }
    ];
    
    stations.forEach(station => {
        const stationElement = document.createElement('div');
        stationElement.className = 'stats-card p-4 rounded-xl cursor-pointer hover:shadow-lg transition-shadow';
        stationElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-800">${station.name}</h4>
                <span class="text-sm text-orange-600 font-medium">${station.distance}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">${station.address}</p>
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">当前: ${station.dogs}只</span>
                <span class="text-gray-500">容量: ${station.capacity}只</span>
            </div>
            <div class="mt-3">
                <button class="w-full bg-orange-500 text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors">
                    查看详情
                </button>
            </div>
        `;
        
        stationElement.addEventListener('click', function() {
            showStationDetails(station.name);
        });
        
        stationsContainer.appendChild(stationElement);
    });
}

// 显示救助站详情
function showStationDetails(stationName) {
    alert(`即将跳转到 ${stationName} 的详细信息页面`);
}

// 显示捐赠模态框
function showDonationModal() {
    document.getElementById('donation-modal').classList.remove('hidden');
    anime({
        targets: '#donation-modal .bg-white',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
    });
}

// 隐藏捐赠模态框
function hideDonationModal() {
    anime({
        targets: '#donation-modal .bg-white',
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInBack',
        complete: function() {
            document.getElementById('donation-modal').classList.add('hidden');
        }
    });
}

// 显示云养模态框
function showCloudAdoptionModal() {
    document.getElementById('cloud-adoption-modal').classList.remove('hidden');
    anime({
        targets: '#cloud-adoption-modal .bg-white',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
    });
}

// 隐藏云养模态框
function hideCloudAdoptionModal() {
    anime({
        targets: '#cloud-adoption-modal .bg-white',
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInBack',
        complete: function() {
            document.getElementById('cloud-adoption-modal').classList.add('hidden');
        }
    });
}

// 移动端菜单切换
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        anime({
            targets: '#mobile-menu',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 300,
            easing: 'easeOutExpo'
        });
    } else {
        anime({
            targets: '#mobile-menu',
            opacity: [1, 0],
            translateY: [0, -20],
            duration: 200,
            easing: 'easeInExpo',
            complete: function() {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// 平滑滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 窗口大小改变时重新调整图表
window.addEventListener('resize', function() {
    if (rescueChart) {
        rescueChart.resize();
    }
    if (rescueTypeChart) {
        rescueTypeChart.resize();
    }
});

// 页面滚动时导航栏效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
});