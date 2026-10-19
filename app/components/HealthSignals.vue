<script setup lang="ts">
const asset = usePublicAsset()

</script>

<template>
<section class="counters">
            <div class="container">
                <div>
                    <i class="fa fa-heartbeat fa-beat fa-4x" style="--fa-animation-duration: 1.5s;"></i>
                    <h3>Heart Rate</h3>
                </div>
                <div>
                    <i class="fas  fa-lungs fa-4x fa-fade" style="--fa-animation-duration: 1.5s;"></i>
                    <h3>Respiratory Rate </h3>
                </div>
                <div>
                    <i class="fas fa-person-falling-burst fa-shake fa-4x fa-bounce" style="--fa-animation-iteration-count:3"></i>
                    <h3>Fall Detection</h3>
                </div>
                <div>
                    <i class="fas fa-shoe-prints fa-rotate-270 fa-flip fa-4x" style="--fa-flip-x: 0.5; --fa-flip-y: 0.5; --fa-animation-duration: 2s;"></i>
                    <h3>Daily Activity Pattern</h3>
                </div>
            </div>
        </section>
</template>
