
package testspring;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;




public class HiveClient {
	static String driverName = "com.mysql.jdbc.Driver";
	static String url = "jdbc:mysql://192.168.100.9:3306/operation_hzfw?useUnicode=true&characterEncoding=utf8";
	static String user = "root";
	static String password = "tianqueshuaige518";
	

//	static String resfile="/data3/yingykf01/intelligent/ycl/test";

	public static void selectModel(String tableName, String dateFilter, String fileUrl) {
		
//		final Logger log = Logger.getLogger(HiveClient.class);
		Statement stmt = null;
		try {
			Class.forName(driverName);
			// InputStreamReader isr = new InputStreamReader(new
			// FileInputStream(sqlfile),"UTF-8");
			Connection conn = DriverManager.getConnection(url, user, password);
			
			String sql = "select * from " + tableName + " where " + dateFilter + " limit 100";
//			PreparedStatement pstm = conn.prepareStatement(sql);
			stmt = conn.createStatement();
			ResultSet res = stmt.executeQuery(sql);
//			pstm.setString(1, tableName);
//			pstm.setString(2, dateFilter);
//			ResultSet res = pstm.executeQuery();
			
			ResultSetMetaData rsmd = res.getMetaData();
			
			int columncount = rsmd.getColumnCount();
			System.out.println("总列数：" + columncount);
			List<String> list = new ArrayList<String>();
			
			BufferedWriter bw = new BufferedWriter(new FileWriter(new File(fileUrl)));
			for(int i = 0 ; i < columncount ; i++){
				list.add(rsmd.getColumnName(i+1));
				if(i<columncount -1){
					bw.write(list.get(i)+"\t");
				}else{
					bw.write(list.get(i)+"\n");
				}				
			}
			
			
			int line = 1;
			while (res.next()) {
				for (int i = 1; i <= columncount; i++) {
					if (res.getString(i)==null) {
						bw.write("\t");
					}else{
						bw.write(res.getString(i)+"\t");
					}
					
					if (i == columncount) {
						bw.write("\n");
					}
				}
				line++;
				bw.newLine();
			}
			
			
			bw.close();
			conn.close();
			conn = null;
			

		} catch (ClassNotFoundException e) {
			e.printStackTrace();
//			log.error(driverName + " not found!", e);
			System.exit(1);
		} catch (SQLException e) {
			e.printStackTrace();
//			log.error("Connection error!", e);
			System.exit(1);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		//selectModel(args[0],args[1],args[2]);
		selectModel("intelligent.weiniao_url_end","cnt > 5","C:\\Users\\jingzhong\\Desktop\\tableData\\test.xlsx");
	}

}
