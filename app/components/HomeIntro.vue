<script setup lang="ts">
const asset = usePublicAsset()

</script>

<template>
<section id="home" class="home">
            <h1>Sensing life. Protecting dignity.</h1>
            <h2>
                <img :src="asset('images/logo-white.PNG')" alt="Vitaray logo" />
                </h2>
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
        </section>

        <section id="vision" class="vision">
            <h1 class="heading">Our Vision</h1>
            <div class="row">
                <div class="content">
                    <h3>A new way to protect seniors — with dignity and data</h3>
                    <p>
                        We believe seniors deserve safety and independence <br/>
                        Without wearables, buttons, or cameras.
                    </p>
                </div>
            </div>
        </section>

        <div class="pt-5 pb-5 vitaray">
            <div class="container">
                <div class="row">
                    <div class="section-head col-sm-12" id="product">
                        <h1>
                            <img :src="asset('images/vitaRay-logo.png')" alt="Vitaray colored logo" />
                        </h1>
                        <p>
                            VitaRay leverages mmWave radar and AI-powered analytics to continuously monitor vital signs, detect falls in real time, and identify early signs of cognitive decline.<br/>
                            all without the need for wearables, cameras, or user interaction.
                        </p>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="item">
                            <span class="icon feature_box_col_one"
                                ><i class="fa-solid fa-user-check"></i></span>
                            <h6>User-friendly Design</h6>
                            <p>
                                No wearables, no user input required
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="item">
                            <span class="icon feature_box_col_two"
                                >
                            <i class="fa-solid fa-video-slash"></i>
                            </span>
                            <h6>Camera-Free System</h6>
                            <p>
                                Suitable for bathroom or bedroom
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="item">
                            <span class="icon feature_box_col_three"
                                >
                            <i class="fa-solid fa-clock fa-spin"></i>
                            </span>
                            <h6>24/7 Health Monitoring</h6>
                            <p>
                                Day and night, unaffected by obstacles
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="item">
                            <span class="icon feature_box_col_four"
                            >
                                <i class="fa-solid fa-screwdriver-wrench"></i>
                            </span>
                            <h6>Low Maintenance</h6>
                            <p>
                                Works silently in the background once set up
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
