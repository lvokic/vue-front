<template>
  <div>
    <!-- 文件上传对话框 -->
    <el-dialog title="上传文件" :visible.sync="dialogVisible" @close="closeDialog">
      <el-upload :action="uploadAction" :show-file-list="false" :before-upload="beforeUpload"
        :on-success="handleSuccess" :on-error="handleError">
        <el-button type="primary">选择文件</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    uploadAction: { // 接受一个动态传入的上传地址
      type: String,
      required: true
    },
    homeworkName: { // 接受作业名称参数
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false, // 控制文件上传对话框的显示与隐藏
    };
  },
  methods: {
    // 打开上传文件对话框
    openDialog() {
      this.dialogVisible = true;
    },

    // 关闭上传文件对话框
    closeDialog() {
      this.dialogVisible = false;
    },

    // 文件上传前的处理
    beforeUpload(file) {
      const isPDF = file.type === 'application/pdf';
      const isTXT = file.type === 'text/plain';  // 添加 TXT 文件类型判断
      const isDOC = file.type === 'application/msword';  // 支持 DOC 文件
      const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';  // 支持 DOCX 文件
      const isLessThan5MB = file.size / 1024 / 1024 < 5; // 限制文件大小为 5MB

      // 提示用户文件类型和大小错误
      if (!isPDF && !isTXT && !isDOC && !isDOCX) {
        this.$message.error('只能上传PDF、TXT、DOC或DOCX文件!');
      }
      if (!isLessThan5MB) {
        this.$message.error('文件不能超过5MB!');
      }

      if ((isPDF || isTXT || isDOC || isDOCX) && isLessThan5MB) {
        const formData = new FormData();
        console.log(this.homeworkName);
        formData.append('file', file);
        formData.append('homeworkName', this.homeworkName); // 将作业名添加到 FormData 中
        // 自定义上传请求
        this.uploadFile(formData);
      }

      return false; // 取消默认的上传行为
    },

    // 上传文件
    uploadFile(formData) {
      this.$flaskAxios
        .post(this.uploadAction, formData)
        .then((response) => {
          if (response.status === 200) {
            this.$message.success('文件上传成功!');
            this.closeDialog();
          } else {
            this.$message.error('文件上传失败!');
          }
        })
        .catch((error) => {
          this.$message.error('文件上传失败!');
        });
    },

    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      this.$message.success('文件上传成功!');
      this.closeDialog();  // 上传成功后关闭上传对话框
    },

    // 上传失败的回调
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败!');
    }
  }
};
</script>