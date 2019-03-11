<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>螺旋丸 - 离线包发布系统</title>
    <link rel="stylesheet" href="/public/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/style.css">
    <link rel="shortcut icon" href="/public/img/favicon.ico">
</head>
<body>
    {% include "component/header.tpl" %}
<div class="wrap">
    {% include "component/header_nav.tpl" %}
    <div class="main-wrap">
        <div id="js-main" >

        </div>
    </div>

    <div id="js-footer">
    </div>
</div>

<script>
    var userName = '{{ userInfo.loginname }}';
</script>
<script src="/public/js/main-build.js"></script>
</body>
</html>
