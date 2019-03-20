import router from '../router.js';

export default {
    install(Vue) {
        Vue.directive('link', {
            bind(el, binding) {
                el.addEventListener('click', () => {
                    if (binding.value) {
                        if (typeof binding.value === 'string') {
                            router.push(binding.value);
                        } else if (binding.value.replace) {
                            router.replace(binding.value.path);
                        } else {
                            router.push(binding.value.path);
                        }
                    }
                });
            }
        });
        Vue.directive('back', {
            bind(el) {
                el.addEventListener('click', () => {
                    router.go(-1);
                });
            }
        });
    }
};
