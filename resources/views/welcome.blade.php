<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>EcoVenture Academy | Empowering Next-Gen Greenpreneurs</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
    <!-- Material Symbols -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "secondary-fixed-dim": "#f4ba9c",
                    "secondary-fixed": "#ffdbca",
                    "surface-container-low": "#eef5f7",
                    "primary-fixed-dim": "#a5d0b9",
                    "on-surface": "#161d1f",
                    "tertiary": "#1f2825",
                    "secondary": "#80543b",
                    "surface-container-highest": "#dde4e6",
                    "surface-container": "#e8eff1",
                    "on-primary-fixed": "#002114",
                    "on-tertiary-container": "#9fa9a3",
                    "on-secondary": "#ffffff",
                    "inverse-surface": "#2b3234",
                    "inverse-on-surface": "#ebf2f4",
                    "error-container": "#ffdad6",
                    "on-background": "#161d1f",
                    "inverse-primary": "#a5d0b9",
                    "surface-tint": "#3f6653",
                    "tertiary-fixed": "#dbe5df",
                    "surface-variant": "#dde4e6",
                    "primary-fixed": "#c1ecd4",
                    "on-error": "#ffffff",
                    "on-tertiary-fixed-variant": "#3f4945",
                    "on-surface-variant": "#414844",
                    "background": "#f4fafd",
                    "on-secondary-container": "#794d36",
                    "on-primary": "#ffffff",
                    "on-tertiary-fixed": "#151d1a",
                    "on-secondary-fixed-variant": "#653d26",
                    "primary": "#012d1d",
                    "surface-container-high": "#e2e9ec",
                    "secondary-container": "#fdc2a3",
                    "on-error-container": "#93000a",
                    "primary-container": "#1b4332",
                    "surface-container-lowest": "#ffffff",
                    "outline": "#717973",
                    "tertiary-fixed-dim": "#bfc9c3",
                    "on-tertiary": "#ffffff",
                    "surface-bright": "#f4fafd",
                    "surface": "#f4fafd",
                    "on-primary-fixed-variant": "#274e3d",
                    "on-primary-container": "#86af99",
                    "error": "#ba1a1a",
                    "outline-variant": "#c1c8c2",
                    "on-secondary-fixed": "#311302",
                    "tertiary-container": "#353e3a",
                    "surface-dim": "#d4dbdd"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-desktop": "48px",
                    "container-max": "1280px",
                    "margin-mobile": "16px",
                    "unit": "8px",
                    "gutter": "24px"
            },
            "fontFamily": {
                    "label-sm": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-xl": ["Hanken Grotesk"],
                    "label-md": ["Inter"],
                    "headline-lg-mobile": ["Hanken Grotesk"],
                    "headline-lg": ["Hanken Grotesk"],
                    "body-lg": ["Inter"],
                    "headline-md": ["Hanken Grotesk"]
            },
            "fontSize": {
                    "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-xl": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "label-md": ["14px", {"lineHeight": "20px", "fontWeight": "600"}],
                    "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        .growth-line-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: dash 5s linear forwards;
        }
        @keyframes dash {
            to { stroke-dashoffset: 0; }
        }
        .hero-gradient {
            background: linear-gradient(135deg, #f4fafd 0%, #e8eff1 100%);
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(193, 200, 194, 0.3);
        }
        .sustainability-score {
            position: absolute;
            top: 16px;
            right: 16px;
            background-color: #fdc2a3;
            color: #311302;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
        }
        @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
            animation: bounceSlow 3s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
<!-- TopNavBar -->
<nav class="w-full sticky top-0 z-50 bg-surface dark:bg-primary-container border-b border-surface-variant dark:border-outline-variant">
    <div class="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div class="flex items-center gap-3">
            <img alt="EcoVenture Academy Logo" class="h-10 w-10" src="https://lh3.googleusercontent.com/aida/ADBb0uhicVzvG3UADM8gAyvvVfQbhdsi25FUEAIoDsezZ2ejsN0_TRa432_44XFzkYiiV5KbOJoaKLUFFmja0C6v54TrNTgHrJHuTdvsmr0sunz_70WUkHZJ4xhNG5X2EqQhZjG6G5TBLSUj3wJj2XFCufXXIuz2JBi6h_kZWU2jSL_AX0gwC4FQHQr4xmSA2oZWlWmfLHwLZRtuM4n2_J4yjZb4q1KkkKzVUn14SOER43RuTIkxBHZRf1exQbsI"/>
            <span class="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">EcoVenture Academy</span>
        </div>
        <div class="hidden md:flex items-center gap-8">
            <a class="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 font-label-md text-label-md" href="#">Courses</a>
            <a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#">Services</a>
            <a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#">Impact</a>
            <a class="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-md text-label-md" href="#">Community</a>
        </div>
        <div class="flex items-center gap-4">
            <a href="/login" class="hidden lg:block text-primary font-label-md text-label-md hover:opacity-80 transition-opacity">Log In</a>
            <a href="/register" class="bg-primary text-on-primary px-6 py-3 rounded-md font-label-md text-label-md hover:scale-95 active:scale-90 transition-transform shadow-sm">Get Started</a>
        </div>
    </div>
</nav>

<main>
    <!-- Hero Section -->
    <section class="hero-gradient relative overflow-hidden pt-20 pb-32">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="relative z-10">
                <span class="inline-block py-1 px-4 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm mb-6">Pioneering Sustainable Education</span>
                <h1 class="text-headline-xl font-headline-xl text-primary mb-6 leading-tight">
                    Empowering Next-Gen <span class="text-secondary">Greenpreneurs</span>
                </h1>
                <p class="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-xl">
                    Transforming sustainable ideas into real-world impact through Project-Based Learning with local UMKM partners. Join a community of innovators redefining the economy.
                </p>
                <div class="flex flex-wrap gap-4">
                    <a href="/register" class="bg-primary text-on-primary h-[48px] px-8 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all group">
                        Join the Mission
                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                    <a href="/login" class="border-2 border-primary text-primary h-[48px] px-8 rounded-md font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center">
                        View Curriculum
                    </a>
                </div>
                <div class="mt-12 flex items-center gap-6">
                    <div class="flex -space-x-3">
                        <div class="w-10 h-10 rounded-full border-2 border-white bg-surface-dim"></div>
                        <div class="w-10 h-10 rounded-full border-2 border-white bg-surface-dim"></div>
                        <div class="w-10 h-10 rounded-full border-2 border-white bg-surface-dim"></div>
                    </div>
                    <p class="text-label-md font-label-md text-on-surface-variant">
                        <span class="text-primary font-bold">500+</span> Student Greenpreneurs enrolled
                    </p>
                </div>
            </div>
            <div class="relative">
                <div class="absolute -top-20 -right-20 w-96 h-96 bg-primary-fixed opacity-20 rounded-full blur-3xl"></div>
                <div class="relative rounded-xl overflow-hidden shadow-2xl">
                    <img class="w-full aspect-[4/3] object-cover" data-alt="A high-angle, modern photograph of young professionals collaborating in a bright, eco-friendly co-working space filled with lush green plants. The lighting is natural and airy, reflecting a clean light-mode aesthetic. They are pointing at a digital screen showing sustainability metrics and maps. The scene evokes a sense of innovation, purpose, and professional educational excellence." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY5bSf7pvKCNsgcN2-peq_Ze1xt-b9Oy8xKQBTg2kWxLOUqJ0k4CSrxyokV9gq6wCtqBhjqGQl0VBreovI0FLUP_fM1uAgQ5DnkoKbL6_7g9xCt9xXyyfu4FX5dIDo3bNlqxLkjrIfn-cs3YBgbPQWY8GL341Z8af-O3b0c6tHDsQRECOYRQu-LQEJmxmut0qn5EMjKcqPdZ6zLQ-1rejm5iiWEvXTuEJe5WAZvfa6O1CMMFKLqQatdY4KqeBn_zaTnSMIo_u61QP4"/>
                </div>
                <!-- Floating Stat Card -->
                <div class="absolute -bottom-8 -left-8 glass-card p-6 rounded-lg shadow-xl max-w-xs animate-bounce-slow">
                    <div class="flex items-center gap-4 mb-2">
                        <div class="p-2 bg-primary text-on-primary rounded-full">
                            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">eco</span>
                        </div>
                        <span class="text-label-md font-label-md text-primary">Live Project Tracker</span>
                    </div>
                    <p class="text-body-md font-body-md text-on-surface mb-3">Supporting 24 local UMKM in waste-reduction efforts.</p>
                    <div class="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div class="h-full bg-secondary w-3/4 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Courses Section -->
    <section class="py-24 bg-surface">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 class="text-headline-lg font-headline-lg text-primary mb-4">Curated Learning Paths</h2>
                    <p class="text-body-md font-body-md text-on-surface-variant max-w-lg">Master the skills needed to thrive in the green economy with our expert-led, project-driven courses.</p>
                </div>
                <a class="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline" href="/login">
                    Explore all courses <span class="material-symbols-outlined">chevron_right</span>
                </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                <!-- Course Card 1 -->
                <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant hover:shadow-lg transition-all group cursor-pointer relative">
                    <div class="sustainability-score">98 Score</div>
                    <img class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A clean, minimalist workspace featuring sustainable product prototypes made of bamboo and recycled plastic. The lighting is soft and studio-quality, casting gentle shadows on a white tabletop. The background is a soft sage green, matching the digital stewardship aesthetic. The image communicates design precision and environmental responsibility." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAz7ZDR4JpkNHb99yiH6SKi5RP5cq5oNUoGyZylnI-0Rl-E1El3Jzx0r6hLwVRbckAxi1wJBWwCT_KVBpchn-LkVIGpBg2X6erZGNt-6qwoYP7JF6scVoIMcXmSqxaqrN2kKtDK0lts2nVx0JvdFmm-VJ_iabODw5xRsL-c_ySRAwDpUYQyrpenDFrmPOUnCvnDb6fHhap9XqY2ynhLXnZUrAUrYlD6K5rqsACx1NrcNszfJj5_H_KzYCvjrQDPOqHhes8yL5SyAeV"/>
                    <div class="p-6">
                        <div class="flex gap-2 mb-4">
                            <span class="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-md text-label-sm font-label-sm">Design</span>
                            <span class="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-md text-label-sm font-label-sm">8 Weeks</span>
                        </div>
                        <h3 class="text-headline-md font-headline-md text-primary mb-3">Sustainable Product Design</h3>
                        <p class="text-body-md font-body-md text-on-surface-variant mb-6">Learn the lifecycle analysis and material science required to build zero-waste products.</p>
                        <div class="flex items-center justify-between border-t border-outline-variant pt-4">
                            <span class="text-primary font-bold">UMKM Partnered</span>
                            <div class="flex items-center gap-1 text-secondary font-label-md">
                                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                4.9
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Course Card 2 -->
                <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant hover:shadow-lg transition-all group cursor-pointer relative">
                    <div class="sustainability-score">92 Score</div>
                    <img class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A conceptual visualization of the circular economy showing interconnected icons of recycling, manufacturing, and consumer use arranged in a loop. The style is modern corporate graphic design with high-end textures and a palette of forest green and soft sage. The lighting is bright and professional, emphasizing a clean-tech future." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVGD11ABAueKi-5Z4ZSUaGGv3psLoXSaxc2NuMONFwKPWYHc9Jj9CIeMBTY1yq2Y9pCcqKQg7Vt2Hs7ZABlcts2EAtUY48ZDJy2eapctYlvxOq2Qm_6ZSq_c0hjMaXPIOY2f6gQfemGmnf6h0wSRZpesJHTFS8geGYTWtxlCj6lFRl-9fl5gmxNW6FHU2Qrgj-P7oFZI1a7Qxl_SxY6EmkjMI4xRzefFyOxiWbXHgafP8hONdgSAMB20mNmrz8SxBRyQPpNp13L4NA"/>
                    <div class="p-6">
                        <div class="flex gap-2 mb-4">
                            <span class="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-md text-label-sm font-label-sm">Business</span>
                            <span class="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-md text-label-sm font-label-sm">6 Weeks</span>
                        </div>
                        <h3 class="text-headline-md font-headline-md text-primary mb-3">Circular Economy 101</h3>
                        <p class="text-body-md font-body-md text-on-surface-variant mb-6">Master the frameworks of closed-loop systems and sustainable supply chain management.</p>
                        <div class="flex items-center justify-between border-t border-outline-variant pt-4">
                            <span class="text-primary font-bold">Foundational</span>
                            <div class="flex items-center gap-1 text-secondary font-label-md">
                                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                4.8
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Course Card 3 -->
                <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant hover:shadow-lg transition-all group cursor-pointer relative">
                    <div class="sustainability-score">95 Score</div>
                    <img class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A professional marketing dashboard on a high-resolution laptop screen displaying growth charts and eco-friendly brand assets. The surrounding environment is a minimalist, light-filled office. The color palette features deep greens and warm clay accents, aligning with a sophisticated corporate aesthetic. The mood is analytical yet visionary." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtMOianU1NrmW9bC5uCpmXxxBAkBL6nFv0hcJcTevkd6d9MRZv3FNB6NXFwwMMxuZXvjj4garynx5k903MZoHk_HDKsQ2GCqb4DMW3SZQBwd78Cb03YKz03rq-84bsOTjXc9tCPc2KbxU67bKvij56c8n1mHN6L9u98JUmuedWe3YNSUtRBkAYKNzniUYlWAvMAOO3T-ep5RZ9gqERUS9NQK91j2_5qJHemlC7t7BlgeUNZXi1xz1trB3o7DvAxkNT3GcUGX9RT-NR"/>
                    <div class="p-6">
                        <div class="flex gap-2 mb-4">
                            <span class="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-md text-label-sm font-label-sm">Marketing</span>
                            <span class="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-md text-label-sm font-label-sm">5 Weeks</span>
                        </div>
                        <h3 class="text-headline-md font-headline-md text-primary mb-3">Green Marketing Strategies</h3>
                        <p class="text-body-md font-body-md text-on-surface-variant mb-6">Communicate value without greenwashing. Ethical branding for the modern conscious consumer.</p>
                        <div class="flex items-center justify-between border-t border-outline-variant pt-4">
                            <span class="text-primary font-bold">Advanced</span>
                            <div class="flex items-center gap-1 text-secondary font-label-md">
                                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                5.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Platform Services Section (Asymmetric Bento Grid) -->
    <section class="py-24 bg-surface-container">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center mb-16">
                <h2 class="text-headline-lg font-headline-lg text-primary mb-4">Our Growth Ecosystem</h2>
                <p class="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">More than just a school. We provide the infrastructure for sustainable career success.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-gutter h-auto lg:h-[600px]">
                <!-- PjBL Framework -->
                <div class="md:col-span-2 md:row-span-1 bg-primary p-10 rounded-xl flex flex-col justify-between text-on-primary group">
                    <div class="max-w-md">
                        <h3 class="text-headline-md font-headline-md mb-4">PjBL Framework</h3>
                        <p class="text-body-md opacity-80 mb-6">Our proprietary Project-Based Learning methodology bridges the gap between theory and actual market execution. Students work on real problems, delivering real solutions.</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full border border-on-primary/30 flex items-center justify-center">
                            <span class="material-symbols-outlined">psychology</span>
                        </div>
                        <span class="text-label-md">Cognitive-centered design</span>
                    </div>
                </div>
                <!-- UMKM Network -->
                <div class="md:col-span-1 md:row-span-2 bg-secondary-container p-10 rounded-xl flex flex-col group relative overflow-hidden">
                    <h3 class="text-headline-md font-headline-md text-on-secondary-container mb-4">UMKM Network</h3>
                    <p class="text-body-md text-on-secondary-container/80 mb-8">Direct access to 150+ verified local Micro, Small, and Medium Enterprises looking for sustainable innovation.</p>
                    <div class="mt-auto space-y-4">
                        <div class="bg-white/40 p-4 rounded-lg flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-secondary"></div>
                            <span class="text-label-sm font-label-sm text-on-secondary-container">Local Craft Co.</span>
                        </div>
                        <div class="bg-white/40 p-4 rounded-lg flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-secondary"></div>
                            <span class="text-label-sm font-label-sm text-on-secondary-container">EcoPack Solutions</span>
                        </div>
                        <div class="bg-white/40 p-4 rounded-lg flex items-center gap-3 translate-x-4">
                            <div class="w-8 h-8 rounded-full bg-secondary"></div>
                            <span class="text-label-sm font-label-sm text-on-secondary-container">Green Logistics</span>
                        </div>
                    </div>
                </div>
                <!-- Portfolio Showcase -->
                <div class="md:col-span-2 md:row-span-1 bg-surface-container-lowest p-10 rounded-xl border border-outline-variant flex flex-col justify-between group">
                    <div class="flex flex-col md:flex-row gap-8 items-center">
                        <div class="flex-1">
                            <h3 class="text-headline-md font-headline-md text-primary mb-4">Portfolio Showcase</h3>
                            <p class="text-body-md text-on-surface-variant mb-6">Build a verifiable track record of impact. Our blockchain-backed certificates prove your contribution to sustainability.</p>
                            <a href="/login" class="text-secondary font-label-md flex items-center gap-2 hover:translate-x-1 transition-transform">
                                Browse Student Success <span class="material-symbols-outlined">arrow_right_alt</span>
                            </a>
                        </div>
                        <div class="w-full md:w-1/3 aspect-square bg-surface-container-low rounded-lg flex items-center justify-center">
                            <span class="material-symbols-outlined text-[64px] text-primary/20">badge</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Impact Section -->
    <section class="py-24 bg-primary text-on-primary">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 class="text-headline-lg font-headline-lg mb-6">Our Collective Footprint</h2>
                    <p class="text-body-lg opacity-80 mb-12">We measure success by the positive change we catalyze in our local ecosystems and the planet at large.</p>
                    <div class="grid grid-cols-2 gap-12">
                        <div>
                            <div class="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2">124+</div>
                            <div class="text-label-md uppercase tracking-wider opacity-60">Projects Completed</div>
                        </div>
                        <div>
                            <div class="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2">18.5k</div>
                            <div class="text-label-md uppercase tracking-wider opacity-60">CO2 Offset (Tons)</div>
                        </div>
                        <div>
                            <div class="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2">150+</div>
                            <div class="text-label-md uppercase tracking-wider opacity-60">UMKM Partners</div>
                        </div>
                        <div>
                            <div class="text-[56px] font-bold text-secondary-fixed-dim leading-none mb-2">84%</div>
                            <div class="text-label-md uppercase tracking-wider opacity-60">Hiring Rate</div>
                        </div>
                    </div>
                </div>
                <div class="relative glass-card bg-primary-container/30 border-primary-fixed/20 p-8 md:p-12 rounded-2xl overflow-hidden">
                    <div class="absolute top-0 right-0 p-4">
                        <span class="material-symbols-outlined text-secondary-fixed-dim opacity-50">analytics</span>
                    </div>
                    <h3 class="text-headline-md font-headline-md mb-8">Real-time Impact Visualization</h3>
                    <div class="space-y-8">
                        <div class="relative">
                            <div class="flex justify-between mb-2">
                                <span class="text-label-md">Waste Diversion</span>
                                <span class="text-label-md text-secondary-fixed-dim">75%</span>
                            </div>
                            <div class="h-1 w-full bg-white/10 rounded-full">
                                <div class="h-full bg-secondary-fixed-dim w-3/4 rounded-full relative">
                                    <div class="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#f4ba9c]"></div>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <div class="flex justify-between mb-2">
                                <span class="text-label-md">Renewable Adoption</span>
                                <span class="text-label-md text-secondary-fixed-dim">42%</span>
                            </div>
                            <div class="h-1 w-full bg-white/10 rounded-full">
                                <div class="h-full bg-secondary-fixed-dim w-[42%] rounded-full relative">
                                    <div class="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#f4ba9c]"></div>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <div class="flex justify-between mb-2">
                                <span class="text-label-md">Economic Growth (Partners)</span>
                                <span class="text-label-md text-secondary-fixed-dim">28%</span>
                            </div>
                            <div class="h-1 w-full bg-white/10 rounded-full">
                                <div class="h-full bg-secondary-fixed-dim w-[28%] rounded-full relative">
                                    <div class="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#f4ba9c]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-12 p-4 bg-white/5 rounded-lg border border-white/10">
                        <p class="text-label-sm italic opacity-70 text-center">"EcoVenture Academy changed how we look at our waste. We've saved 15% in operational costs by implementing student designs." — UMKM Partner</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-surface-bright relative overflow-hidden">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
            <h2 class="text-headline-xl font-headline-xl text-primary mb-6">Ready to lead the change?</h2>
            <p class="text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Applications are now open for the Spring 2024 cohort. Limited spots available for high-impact candidates.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/register" class="bg-primary text-on-primary h-[48px] px-12 rounded-md font-label-md text-label-md hover:scale-105 transition-transform flex items-center justify-center">Apply Now</a>
                <a href="/login" class="border border-outline text-primary h-[48px] px-12 rounded-md font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center">Request a Consultation</a>
            </div>
        </div>
        <!-- Background Decoration -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[200px] bg-primary-fixed opacity-10 rounded-[100%] blur-3xl"></div>
    </section>
</main>

<!-- Footer -->
<footer class="w-full py-12 bg-primary dark:bg-primary-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div>
            <div class="flex items-center gap-3 mb-6">
                <img alt="EcoVenture Academy Logo" class="h-8 w-8 brightness-0 invert" src="https://lh3.googleusercontent.com/aida/ADBb0uhicVzvG3UADM8gAyvvVfQbhdsi25FUEAIoDsezZ2ejsN0_TRa432_44XFzkYiiV5KbOJoaKLUFFmja0C6v54TrNTgHrJHuTdvsmr0sunz_70WUkHZJ4xhNG5X2EqQhZjG6G5TBLSUj3wJj2XFCufXXIuz2JBi6h_kZWU2jSL_AX0gwC4FQHQr4xmSA2oZWlWmfLHwLZRtuM4n2_J4yjZb4q1KkkKzVUn14SOER43RuTIkxBHZRf1exQbsI"/>
                <span class="text-headline-md font-headline-md font-bold text-on-primary dark:text-on-primary-container text-white">EcoVenture Academy</span>
            </div>
            <p class="text-body-md font-body-md text-on-primary/80 dark:text-on-primary-container/80 max-w-sm text-slate-300">
                Nurturing the next generation of Greenpreneurs through project-based education and local enterprise partnership.
            </p>
        </div>
        <div class="flex flex-col md:items-end justify-between text-slate-300">
            <div class="flex flex-wrap gap-6 mb-8">
                <a class="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Privacy Policy</a>
                <a class="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Terms of Service</a>
                <a class="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">Contact Us</a>
                <a class="hover:text-white transition-colors font-label-md text-label-sm hover:underline" href="#">About Our UMKM Partners</a>
            </div>
            <p class="text-label-sm font-label-sm opacity-60 text-slate-400">
                &copy; 2026 EcoVenture Academy. Nurturing the next generation of Greenpreneurs.
            </p>
        </div>
    </div>
</footer>

<script>
    // Micro-interaction for smooth scrolling and hover effects
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Atmospheric effect: subtle parallax on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-gradient img');
        if(heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section > div').forEach(section => {
        section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });
</script>
</body>
</html>
