<template>
  <div>
    <t-space direction="vertical">
      <t-tabs :default-value="1">
        <t-tab-panel :value="1" label="选项卡1">
          <p style="margin: 20px">选项卡1内容区</p>
        </t-tab-panel>
        <t-tab-panel :value="2" label="选项卡2">
          <p style="margin: 20px">选项卡2内容区</p>
        </t-tab-panel>
        <t-tab-panel :value="3" label="选项卡3">
          <p style="margin: 20px">选项卡3内容区</p>
        </t-tab-panel>
      </t-tabs>
      <t-tabs default-value="1">
        <t-tab-panel value="1" label="选项卡1" :destroyOnHide="false">
          <div style="margin: 10px">
            <t-space>
              <t-radio-group default-value="2">
                <t-radio-button value="1">选项一</t-radio-button>
                <t-radio-button value="2">选项二</t-radio-button>
                <t-radio-button value="3">选项三</t-radio-button>
                <t-radio-button value="4">选项四</t-radio-button>
              </t-radio-group>
              <t-button theme="primary">搜索</t-button>
            </t-space>
          </div>
        </t-tab-panel>
        <t-tab-panel value="2" label="选项卡2" :destroyOnHide="false">
          <template #panel>
            <t-button variant="text" theme="primary">link to</t-button>
          </template>
        </t-tab-panel>
      </t-tabs>
      <t-space>
        <t-table
          rowKey="index"
          :data="data"
          :columns="columns"
          :bordered="false"
          :pagination="pagination"
        ></t-table>
      </t-space>
    </t-space>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import {
  ErrorCircleFilledIcon,
  CheckCircleFilledIcon,
  CloseCircleFilledIcon
} from 'tdesign-icons-vue-next'

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> }
}
const data = []
const total = 28
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3]
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4]
  })
}

const columns = ref([
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    cell: (h, { row }) => {
      return (
        <t-tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
          {statusNameListMap[row.status].icon}
          {statusNameListMap[row.status].label}
        </t-tag>
      )
    }
  },
  { colKey: 'channel', title: '签署方式' },
  { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '申请时间' }
])

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  total
}
</script>

<style lang="scss" scoped></style>
