<template>
    <div class="user-image-item" >
        <div class="user-image-Upload" @click="handleUpload">
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
        
        <!-- 头像弹框 -->
        <el-dialog
            width="500px"
            :title="$t('message.uploadAvatar')"
            :visible.sync="upDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @closed="handleClose">
            <div class="upload-box">
                <div class="upload-tips">{{$t('message.imgType')}}</div>
                <div class="upload-content">
                    <div class="upload-content-left">
                        <div class="upload-content-img">
                            <img :src="originalImg||img" alt="" :style="{transform: 'scale('+ scaleNum +')'}">
                        </div>
                        <div class="upload-content-bot">
                            <span class="upload-content-upload" @click="clickUpload">{{$t('message.clickUpload')}}</span>
                            <span class="upload-content-zoom">
                                <i class="el-icon-remove-outline" @click="scaleHanlde(1)"></i>
                                <i class="el-icon-circle-plus-outline" @click="scaleHanlde(2)"></i>
                            </span>
                        </div>
                    </div>
                    <div class="upload-content-right">
                         <img :src="originalImg||img" alt="">
                         <span class="upload-content-dec">{{$t('message.avatarPreview')}}</span>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmUpload">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return{
        upDialogVisible: false,
        scaleNum: 1, // 图片放大,
        originalImg: '' // 原图片
    }
  },
  props: {
      onSuccess: Function,// eslint-disable-line
        isShowModify: {
            type: Boolean,
            default: true,
            originaRawFile: ''
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
    // 上传弹框
    handleUpload () {
        this.upDialogVisible= true
    },
    // 点击上传
    clickUpload() {
        this.$refs['upload-input'].click()
    },
    // 图片缩放
    scaleHanlde(type) {
        let num = this.scaleNum
        if(num<=0.5 && type==1){
          return
        }
        if(num>=3 && type==2){
            return
        }
        type ==1 ? num-=0.5 : num+=0.5
        this.scaleNum = num
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
      const imgUrl = URL.createObjectURL(rawFile)
      this.originalImg = imgUrl
      this.originaRawFile = rawFile
    },
    // 确认上传图片
    confirmUpload() {
      this.$emit('update:img', this.originalImg)
      if (this.onSuccess) {
        this.onSuccess(this.originaRawFile)
      }
      this.upDialogVisible = false
    },
    handleClose() {
      this.originalImg = ''
      this.originaRawFile = ''
    }
  }
}
</script>

<style lang="less" scoped>
 .user-image-item{
    .user-image-Upload{
        position: relative;
        width: 180px;
        height: 180px;
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
            cursor: pointer;
        }
        &:hover > .modify-imge:first-child{
            display: inline-flex;
        } 
    }
       
    .upload-input {
        display: none;
        z-index: -9999;
    }

    .upload-box{
        border-bottom: 1px #eee solid;
        padding-bottom: 30px;
        .upload-tips {
            font-size: 12px;
            color: #ACBBCA;
            margin-bottom: 20px;
        }
        .upload-content {
            display: flex;
            justify-content: space-between;
            .upload-content-left {
                .upload-content-img{
                    overflow: hidden;
                }
                width: 300px;
                /* flex: 1; */
                img{
                    display: block;
                    width: 100%;
                }
                .upload-content-bot {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 10px;
                    span.upload-content-upload {
                        color: #FF5B5B;
                        font-size: 14px;
                        cursor: pointer;
                        &:hover{
                            color: #de1e1e;
                        }
                    }
                    span.upload-content-zoom {
                        width: 40px;
                        display: flex;
                        justify-content: space-between;
                        color: #919191;
                        i{
                            cursor: pointer;
                        }
                    }
                }
            }
            .upload-content-right {
                width: 160px;
                text-align: center;
                img{
                    display: block;
                    width: 120px;
                    border-radius: 50%;
                    margin: 0 auto;
                }
                span.upload-content-dec {
                    display: block;
                    padding: 10px 0;
                    font-size: 12px;
                    color: #A6B6C6;
                    
                }
            }
        }
    }

}

/deep/.el-dialog__body{
    padding: 0 20px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
</style>