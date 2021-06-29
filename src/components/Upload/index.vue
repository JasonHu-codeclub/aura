<template>
    <div class="user-image-item" @click="handleUpload">
        <span v-if="isShowModify" class="modify-imge">{{$t('button.modifyUserImg')}}</span>
        <el-image
            style="width: 100%; height: 100%"
            :style="circle ? radiusStyle : ''"
            :src="img"
            fit="cover"
        >
        </el-image>
        <input
            ref="upload-input"
            class="upload-input"
            type="file"
            accept=".jpeg, .png,.jpg"
            @change="handleInput"
        />
        
    </div>
</template>

<script>
export default {
  data() {
    return{
        
    }
  },
  props: {
      onSuccess: Function,// eslint-disable-line
        isShowModify: {
            type: Boolean,
            default: true
        },
        // 是否圆形
        circle: {
            type: Boolean,
            default: true
        },
        zIndex: {
            type: Number,
            default: 1
        },
        width: {
            type: String,
            default: '90px'
        },
        height: {
            type: String,
            default: '90px'
        },
        img: {
            type: String,
            default: 'http://up.enterdesk.com/edpic/31/c3/fd/31c3fdc63511cabedd6415d121fa2d58.jpg'
        },
        radiusStyle: {
            borderRadius: '50%'
        }
  },
  methods: {
    handleUpload () {
      this.$refs['upload-input'].click()
    },
    handleInput (e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload (rawFile) {
      this.$refs['upload-input'].value = null // fix can't select the same excel
      const isJPG = rawFile.type === 'image/jpeg' || 'image/png'
      const isLt2M = rawFile.size / 1024 / 1024 < 2
      console.log(rawFile)
      const imgUrl = URL.createObjectURL(rawFile)
      this.$emit('update:img', imgUrl)
      if (this.onSuccess) {
        this.onSuccess(rawFile)
      }
    },
  }
}
</script>

<style lang="less" scoped>
 .user-image-item{
      width: 180px;
      height: 180px;
      cursor: pointer;
      overflow: hidden;
      border-radius: 50%;
      background-size: cover;
      .modify-imge{
         display: none;
         position: absolute;
         top: 0;
         left: 0;
         width: 180px;
         height: 180px;
         border-radius: 50%;
         justify-content: center;
         align-items: center;
         color: #fff;
         font-size: 14px;
         background-color: rgba(0,0,0,0.3);
         z-index: 1000;
      }
      &:hover > .modify-imge:first-child{
         display: inline-flex;
      }  
    .upload-input {
        display: none;
        z-index: -9999;
    }
   }
</style>