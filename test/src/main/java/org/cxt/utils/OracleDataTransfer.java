package org.cxt.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class OracleDataTransfer {
	/**
	 * oracle 数据库数据复制，从一个数据库到另一个数据库
	 * 解决不能使用oracle高版本exp命令，从低版本数据库导出到高版本数据库 报错903问题
	 * @param args
	 */
	public static void main(String[] args) {
		Connection con = null;// 创建一个数据库连接
		PreparedStatement pre = null;// 创建预编译语句对象，一般都是用这个而不用Statement
		ResultSet result = null;// 创建一个结果集对象
		ResultSet result2 = null;// 创建一个结果集对象
		ResultSet result3 = null;// 创建一个结果集对象
		Statement stmt = null;
		Connection con2 = null;
		Statement stmt2 = null;

		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");// 加载Oracle驱动程序
			System.out.println("开始尝试连接数据库！");
			String url = "jdbc:oracle:thin:@192.168.10.190:1521:orcl";// 127.0.0.1是本机地址，XE是精简版Oracle的默认数据库名
			String user = "qinghaitqcms";// 用户名,系统默认的账户名
			String password = "qinghaitqcms";// 你安装时选设置的密码
			con = DriverManager.getConnection(url, user, password);// 获取连接
			String url2 = "jdbc:oracle:thin:@localhost:1521:orcl";//
			String user2 = "tqcms";// 用户名,系统默认的账户名
			String password2 = "tqcms";// 你安装时选设置的密码
			con2 = DriverManager.getConnection(url2, user2, password2);//
			stmt2 = con2.createStatement();

			stmt = con.createStatement();
			List<String> tablst = new ArrayList<String>();
			String tabName;
			List<String> collst = new ArrayList<String>();
			String colName;
			result = stmt.executeQuery("select table_name from user_tables");
			while (result.next()) {
				tabName = result.getString("table_name");
				tablst.add(tabName);
				System.out.println(tabName);
			}
			result.close();

			ResultSetMetaData m = null;
			List<String> createTableList = new ArrayList<String>();
			for (String tableName : tablst) {
				result = stmt
						.executeQuery("select dbms_metadata.get_ddl('TABLE','"
								+ tableName + "') from dual");
				while (result.next()) {
					String createTable = result.getString(1);
					createTable = createTable.replace("\"QINGHAITQCMS\".", "")
							.replace("TIANQUE", "TQCMS");
					createTableList.add(createTable);
				}
			}
			result.close();
			for (int i = 0; i < createTableList.size(); i++) {
				System.out.println(createTableList.get(i));
				stmt2.executeUpdate(createTableList.get(i));
			}
			for (String tableName : tablst) {
				result = stmt.executeQuery("select * from " + tableName);
				System.out.println("当前插入数据到：" + tableName);
				while (result.next()) {
					m = result.getMetaData();
					List<String[]> dataList = new ArrayList<String[]>();
					if (tableName.equals("COMMUNITYMEMBER")) {
						System.out.println(tableName);
					}
					for (int i = 0; i < m.getColumnCount(); i++) {
						System.out.println("列类型" + m.getColumnTypeName(i + 1)
								+ "-" + m.getColumnType(i + 1));
						String type = m.getColumnTypeName(i + 1);
						String re = null;
						if (type.equals("DATE")) {
							Date date = result.getDate(i + 1);
							SimpleDateFormat sdf = new SimpleDateFormat(
									"yyyy-MM-dd HH:mm:ss");
							if (date != null) {
								re = sdf.format(date);
							}
						} else {
							re = result.getString(i + 1);
						}
						if (re == null) {
							dataList.add(null);
						} else {
							dataList.add(new String[] { re, type });
						}
					}
					String insertSql="insert into "+tableName+" values(";
					for (String[] data : dataList) {
						if(data==null){
							insertSql+="null,";
						}else{
							String d = data[0];
							String type = data[1];
							if (type.equals("DATE")) {
								d = "to_date('" + d
										+ "','yyyy-mm-dd hh24:mi:ss')";
								insertSql += d + ",";
							} else {
								d = d.replace("'", "''");
								insertSql += "'" + d + "',";
							}

						}
					}
					insertSql = insertSql.substring(0, insertSql.length() - 1);
					insertSql += ")";
					System.out.println(insertSql);
					stmt2.executeUpdate(insertSql);
				}
			}

			// System.out.println("连接成功！");
			// String sql = "select * from student where name=?";//
			// 预编译语句，“？”代表参数
			// pre = con.prepareStatement(sql);// 实例化预编译语句
			// pre.setString(1, "刘显安");// 设置参数，前面的1表示参数的索引，而不是表中列名的索引
			// result = pre.executeQuery();// 执行查询，注意括号中不需要再加参数
			// while (result.next())
			// // 当结果集不为空时
			// System.out.println("学号:" + result.getInt("id") + "姓名:"
			// + result.getString("name"));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				// 逐一将上面的几个对象关闭，因为不关闭的话会影响性能、并且占用资源
				// 注意关闭的顺序，最后使用的最先关闭
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
				System.out.println("数据库连接已关闭！");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
