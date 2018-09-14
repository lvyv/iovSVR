<template>
  <d2-container>
  <template slot="header">
  <title>WEBSSH</title>
  <style>
    body {background-color: #000;height: 100%;margin: 0;}.dropup-content {display: none;}
  </style>
   <link rel="stylesheet" href="/webssh.css" />
  </template>
  <template>
  <div class="box" id='webssh'>
    <div id="header"></div>
    <div id="terminal-container" class="terminal"></div>
    <div id="bottomdiv">
      <div class="dropup" id="menu">
        <i class="fas fa-bars fa-fw"></i> Menu
        <div class="dropup-content">
          <a id="logBtn" href="javascript:void(0);"><i class="fas fa-clipboard fa-fw"></i> Start Log</a>
          <a id="downloadLogBtn" href="javascript:void(0);"><i class="fas fa-download fa-fw"></i> Download Log</a>
          <a id="credentialsBtn" href="javascript:void(0);"><i class="fas fa-key fa-fw"></i> Credentials</a>
        </div>
      </div>
      <div id="footer"></div>
      <div id="status"></div>
    </div>
  </div>>
</template>

  </d2-container>
</template>

<script>
require('ssh.js')
</script>