<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 160px;" placeholder="请输入关键字" />
      <el-select v-model="listQuery.type" multiple style="width: 200px" class="filter-item" placeholder="请选择类型">
        <el-option v-for="(key, value) in typeMap" :key="key" :label="key" :value="value" />
      </el-select>
      <el-input v-model="listQuery.status" clearable class="filter-item" style="width: 160px;" placeholder="请选择状态" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    <!--<el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    </div>
    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="list" style="width: 100%" element-loading-text="查询中...">
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名" width="100" />
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeTagFilter">
            {{ scope.row.type | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purchasingPrice" label="进价 元/kg" width="100" />
      <el-table-column prop="purchasingPrice" label="售价 元/kg" width="100" />
      <el-table-column prop="stageName" label="花名" width="150" />
      <el-table-column prop="source" label="来源" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.source | sourceTagFilter">
            {{ scope.row.source | sourceFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sourceUrl" label="阿里url" />
      <el-table-column prop="sourceImg" label="店铺二维码" width="200">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.sourceImg != null && scope.row.sourceImg !== undefined && scope.row.sourceImg !== ''"
            style="width: 58px; height: 100px"
            :src="scope.row.sourceImg"
            :preview-src-list="srcList"
            @click="onPreview(scope.row.sourceImg)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="上下架状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTagFilter" >
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="onShelves(scope.row.id,1)"> 下架 </el-button>
          <el-button v-if="scope.row.status === 1" type="danger" size="mini" @click="onShelves(scope.row.id,0)"> 上架 </el-button>
          <el-button v-if="scope.row.status === 2" type="danger" size="mini" @click="onShelves(scope.row.id,1)"> 下架 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { listProduct } from '@/api/product'
import Pagination from '@/components/Pagination'

const typeMap = {
  1: '蔬菜干',
  2: '水果干',
  3: '糖',
  4: '蜜饯',
  5: '话梅'
}
const typeTagMap = {
  1: 'success',
  2: '',
  3: 'danger',
  4: 'info',
  5: 'warning'
}
const sourceMap = {
  0: '总部',
  1: '阿里',
  2: '其他'
}
const sourceTagMap = {
  0: 'success',
  1: '',
  2: 'warning'
}
const statusMap = {
  0: '正常',
  1: '淘汰',
  2: '部分淘汰'
}
const statusTagMap = {
  0: 'success',
  1: 'danger',
  2: 'warning'
}

export default {
  name: 'ProductList',
  components: { Pagination },
  filters: {
    typeFilter(status) {
      return typeMap[status]
    },
    typeTagFilter(status) {
      return typeTagMap[status]
    },
    sourceFilter(source) {
      return sourceMap[source]
    },
    sourceTagFilter(source) {
      return sourceTagMap[source]
    },
    statusFilter(source) {
      return statusMap[source]
    },
    statusTagFilter(source) {
      return statusTagMap[source]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        source: '',
        type: '',
        status: ''
      },
      detailDialogVisible: false,
      srcList: [''],
      downloadLoading: false,
      typeMap,
      typeTagMap
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      listProduct(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },

    onShelves(productId, status) {
      console.log(productId, status)
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    onPreview(url) {
      this.srcList = [url]
    }
  }
}
</script>
