<template>
	<div>
		<div class="search el-row--flex is-justify-space-between">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="form.name"
					          placeholder="房东姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.name"
					          placeholder="推荐人"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.name"
					          placeholder="房源位置"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="form.status"
					           placeholder="状态">
						<el-option label="未开通"
						           :value="1"></el-option>
						<el-option label="已开通"
						           :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"
					           @click="handleSubmit">搜索</el-button>
				</el-form-item>
			</el-form>
			<div>
				<el-button type="primary"
				           @click="handleAdd">添加房东</el-button>
			</div>
		</div>
		<div class="table">
			<el-table :data="data"
			          stripe>
				<el-table-column type="index"
				                 label="序号"
				                 width="50"></el-table-column>
				<el-table-column prop="name"
				                 label="姓名"
				                 width="80"></el-table-column>
				<el-table-column prop="phone"
				                 label="手机号"
				                 width="120"></el-table-column>
				<el-table-column prop="name"
				                 label="推荐人"
				                 width="120"></el-table-column>
				<el-table-column prop="name"
				                 label="房源数量"
				                 width="80"></el-table-column>
				<el-table-column prop="name"
				                 label="发布数量"
				                 width="80"></el-table-column>
				<el-table-column prop="name"
				                 label="房源位置"></el-table-column>
				<el-table-column prop="name"
				                 label="状态"
				                 width="80"></el-table-column>
				<el-table-column prop="name"
				                 label="状态"
				                 width="80"></el-table-column>
				<el-table-column prop="name"
				                 label="申请时间"
				                 width="120"></el-table-column>
				<el-table-column width="240">
					<template slot-scope="scope">
						<el-button size="small"
						           type="warning"
						           @click="handleCheck(scope.row)">审核</el-button>
						<el-button size="small"
						           @click="handleEdit(scope.row)">编辑</el-button>
						<el-button size="small"
						           type="danger"
						           @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					status: ''
				},
				page: 1,
				count: 0,
				data: [
					{
						name: '江建华',
						phone: '13123456789'
					},
					{
						name: '娇娇',
						phone: '13123456789'
					},
					{
						name: '依然',
						phone: '13123456789'
					}
				]
			};
		},
		mounted() {
			this.$nextTick(this.getData);
		},
		methods: {
			getData(page) { },
			handleSubmit() {
				this.getData(1);
			},
			handleAdd() {
				this.$router.push('/landlord/add');
			},
			handleCheck(item) {
				this.$confirm('确认审核通过该条信息？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '操作成功!'
					});
				});
			},
			handleEdit(item) {
				if (item.id) {
					this.$router.push(`/landlord/${item.id}`);
				}
			},
			handleDel(item) {
				console.log(item);
				this.$confirm('确认删除该条信息？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '操作成功!'
					});
				});
			}
		}
	};
</script>

<style></style>
