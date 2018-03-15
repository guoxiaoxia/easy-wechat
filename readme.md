# 项目使用方式
1. 初始化项目: `script/init_env.sh`，回车即可
2. 启动项目: `script/start.sh`
3. 利用小程序开发框架: 配合测试

# env.js
项目中使用 `env.js` 文件来定义一些环境信息（如全局变量），根目录的 `env.js` 文件定义了整个项目的环境信息。

# 全局变量
各个模块中可用的全局变量有: 

1. 全局可用的全局变量: 
    - `Common`: 全局定义
    - `Config`: 配置中心派发出来的配置
    - `PROJECT_ROOT`: 项目根目录
    - `CLIENT`: client 位置
    - `SCHEMA_DIR`: schema 目录

## Mysql Key Spec

ORM Framework 认为，框架本身应该是对 key 长度透明的，但是由于 Mysql 的 key 长度限制，在建库的时候我们需要根据我们的业务需要指定 id、subject、object 的长度。我们统一在 Service 的 model 目录中，放置一个声明 key_spec 的文件，方便统一建库:

```bash
model
├── dev
│   ├── object
│   └── relation
├── prod
│   ├── object
│   └── relation
└── mysql_key_spec # your key spec file
```

文件的定义方式如下: 
```
格式:
object   object_name   id_key_spec
relation relation_name subject_key_spec

eg:
object   playlist      CHAR(32)
relation playlist.song CHAR(32)
```

# 测试

用测试框架来写, 测试前先要启动好基础服务 (mysql, memcached), 然后还要把相关的服务都拉起来(service)，每执行一个场景之前，框架会执行一遍 test/data/init 脚本初始化数据，执行完场景之后会执行 test/data/fini 脚本清理数据。

## api 接口测试

1. 启动服务
```
toolchain/start.sh -s [official | simulator]
```

2. 执行测试
进入 test 执行 mocha

## 覆盖率测试

直接执行 `toolchain/cover.sh` 脚本，将使用 istanbul 拉起所有服务，并使用 api 的测试用例进行测试，执行完成之后会在 PROJECT\_ROOT/coverage 目录中中生成包括 api，service 的覆盖率数据。使用浏览器打开 `PROJECT_ROOT/coverage/lcov-report/index.html` 即可看到覆盖率相关信息。
脚本执行时可以传入 mocha 的参数，比如想执行指定的测试用例，直接 toolchain/cover.sh -g xxx 即可。

