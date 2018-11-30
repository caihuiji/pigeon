<div class="header-nav">
    <div class="header-title">
        螺旋丸 - 离线包发布系统
    </div>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            {% if breadcrumb == 'detail' %}
            <li class="breadcrumb-item " aria-current="page"><a href="/">首页</a></li>
            <li class="breadcrumb-item active" aria-current="page">
                {% if prj_name %}
                <span style="font-weight: 700">{{ prj_name }}</span>
                {% else %}
                详情
                {% endif %}
            </li>
            {% else %}
            <li class="breadcrumb-item active" aria-current="page">&nbsp;</li>
            {% endif %}
        </ol>
    </nav>
</div>
