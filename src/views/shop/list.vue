<template>
  <div>
    <el-container>
      <el-header />
      <el-main>
        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="list" style="width: 100%" element-loading-text="查询中...">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center">
            <template slot-scope="scope">
              <span>{{(listQuery.page - 1) * listQuery.limit + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="店名" width="140" />
          <el-table-column prop="address" label="地址"/>
          <el-table-column prop="imageUrl" label="图片">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.imageUrl"
                :preview-src-list="srcList"
                @click="onPreview(scope.row.imageUrl)">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="businessLicense" label="营业执照" >
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.businessLicense">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" @click="checkInventory(scope.row.id)">查看库存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { listShop } from '@/api/shop'
import Pagination from '@/components/Pagination'

export default {
  name: 'ShopList',
  components: { Pagination },

  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      detailDialogVisible: false,
      srcList: [''],
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      listShop(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },

    checkInventory(shopId) {
      console.log(shopId)
    },

    onPreview(url) {
      this.srcList = [url]
    }
  }
}
</script>
