<div class="header-nav">
    <div class="header-title">
        pigeon - 离线包发布系统
    </div>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            {% if breadcrumb == 'detail' %}
            <li class="breadcrumb-item " aria-current="page"><a href="/">首页</a></li>
            <li class="breadcrumb-item active" aria-current="page">详情</li>
            {% else %}
            <li class="breadcrumb-item active" aria-current="page">&nbsp;</li>
            {% endif %}
        </ol>
    </nav>
</div>