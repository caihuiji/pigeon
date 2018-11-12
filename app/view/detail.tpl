<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>pigeon</title>
    <link rel="stylesheet" href="/public/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/style.css">
</head>
<body>
{% set breadcrumb = "detail" %}
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
    var refer_id = '{{ refer_id }}';
    var userName = '{{ userInfo.loginname }}';
</script>

<script src="/public/js/detail-build.js"></script>
</body>
</html>
