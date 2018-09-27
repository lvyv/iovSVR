# iovSVR
Internet of vehicle platform template, rapid development &amp; deployment &amp; remote diagnostics.

## 快速入门 ##

一、window/Linux系统安装指南

1. 下载和安装nodejs（8.11.4），git工具（TortoiseGit）
2. npm install -g nrm
3. nrm use taobao
4. git clone https://github.com/lvyv/iovSVR.git iovSVR
5. cd iovSVR
6. npm i
7. npm start

二、系统概览图
> 基本概念

-  **资产**：资产是物理世界的实体，比如车辆、桥梁、车间。
-  **设备**：设备是安装在现场的资产上的，用以获取传感数据或回传远端指令的设备。
-  **通道**：通道是设备中对采集的物理量的最小逻辑分辨单位，比如某个基于GPIO的通道可能对应1个开关量，又比如某路ADC对应温度传感值，再比如CAN中某个特定ID的包。
-  **数据**：通道中采集来的Key-Value值。
-  **用户**：用户是拥有资产的系统使用者。
![](https://github.com/lvyv/iovSVR/blob/master/doc/smart-vehicle.svg)
iovSVR——易通星云的物联网平台，iovBOX——易通星云的物联网边缘计算网关。
![](https://github.com/lvyv/iovSVR/blob/master/doc/architecture.png)


