<template>
    <wrap>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </wrap>
</template>

<script>
import Wrap from '../components/Wrap.vue'
export default {
    components: {
        Wrap
    }
}
</script>

