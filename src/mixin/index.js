import api from '../api';

const mixin = {
    data() {
        return {
            addr: null,
            addrList: null,
            uploadUrl: 'http://house.zhiqiang.ink/api/upload/uploadImage'
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getArea() {
            api.addr.area().then(res => {
                if (res.data) {
                    this.addrList = {};
                    this.addr = res.data
                        ? res.data.map(item => {
                              this.addrList[item.id] = item.name;
                              if (item.children) {
                                  const ichildren = item.children.map(it => {
                                      this.addrList[it.id] = it.name;
                                      if (it.children) {
                                          const jchildren = it.children.map(i => {
                                              this.addrList[i.id] = i.name;
                                              return {
                                                  value: i.id,
                                                  label: i.name
                                              };
                                          });
                                          return {
                                              value: it.id,
                                              label: it.name,
                                              children: jchildren
                                          };
                                      }
                                      return {
                                          value: it.id,
                                          label: it.name
                                      };
                                  });
                                  return {
                                      value: item.id,
                                      label: item.name,
                                      children: ichildren
                                  };
                              }
                              return {
                                  value: item.id,
                                  label: item.name
                              };
                          })
                        : [];
                }
            });
        }
    }
};

export default mixin;
