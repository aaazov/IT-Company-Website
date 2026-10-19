<script setup lang="ts">
const asset = usePublicAsset()

</script>

<template>
<section class="team" style="margin-top: 7rem">
            <h1 class="heading" style="margin-top: -1.5rem" id="team">
                Our Team
            </h1>
            <p></p>
            <div class="row">
                <div class="card">
                    <div class="image">
                        <img
                            :src="asset('images/jxs.png')"
                            alt="Team member 1"
                        />
                    </div>
                    <div class="info">
                        <h3>Jason Jiang</h3>
                        <span>Co-founder</span>
                        <p class="degree">MEEE</p>
                        <p class="intro">10+ years in health tech translation and cross-border innovation</p>

                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card">
                    <div class="image">
                        <img
                            :src="asset('images/wjq.png')"
                            alt="Team member 1"
                        />
                    </div>
                    <div class="info">
                        <h3>Jackie Wang</h3>
                        <span>CEO</span>
                        <p class="degree">Ph.D</p>
                        <p class="intro">10+ years in health tech
                            translation and cross-border innovation</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card">
                    <div class="image">
                        <img
                            :src="asset('images/wf.png')"
                            alt="Team member 1"
                        />
                    </div>
                    <div class="info">
                        <h3>Evan Wu</h3>
                        <span>CTO</span>
                        <p class="degree">Ph.D</p>
                        <p class="intro">10+ years experience in IoT, wireless networks,
                            edge and cloud
                            computing
                        </p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card">
                    <div class="image">
                        <img
                                :src="asset('images/wyf.png')"
                                alt="Team member 1"
                        />
                    </div>
                    <div class="info">
                        <h3>Yifan Wei</h3>
                        <span>Systems Engineer</span>
                        <p class="degree">MIS</p>
                        <p class="intro">5 years experience in information systems</p>
                    </div>
                </div>
            </div>
        </section>
</template>
