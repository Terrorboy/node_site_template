import model from '../models/index.js';
import md5 from 'md5';

export default (router)=>{
    const
        sns_prefix = {
            'kakao':'k@',
            'google':'g@',
            'naver':'n@',
        },
        sns_type = {
            'google':1,
            'kakao':2,
            'naver':3,
        }
    ;

    // 로그아웃 처리
    router.get('/logout', (req, res)=>{
        if (!req.session.token) {
            return res.json({});
        }
        req.session.destroy();
        return res.json({result: true});
    });

    // 로그인 처리
    router.post('/login', (req, res)=>{
        const post = req.body;
        const id = sns_prefix[post.type]+post.uniq;
        if (req.session.token) {
            return res.json({ result: true });
        }
        model.user.userFind(id, 'id')
        .then((result)=>{
            if (result.idx) {
                const token = md5(result.id+Date.now())
                req.session.token = token;
                return res.status(200).json({ result: true });
            } else {
                return res.status(200).json({ result: false });
            }
        })
        .catch((error)=> {
            console.log(error)
            return res.status(500).json({result: error});
        })
    });

    // 내정보 조회
    router.get('/me', (req, res)=>{
        if (!req.session.token) {
            return res.json({});
        }
        model.user.userFind(req.session.token, 'token')
            .then((result)=>{
                return res.json(result);
            })
            .catch(()=>{
                if (!req.session.token) {
                    return res.json({});
                }
            })
        ;
    });

    // 회원 리스트 조회
    router.get('/users', (_, res)=>{
        const user = model.user.listAll([
            {'deleted_at':'is null'},
            {'':'deleted_at is null'},
            {'':'deleted_at is null'}
        ]);
        user.then((result)=>{
            res.status(200).json(result);
        }).catch((error)=>{
            res.status(500).json(error);
        })
    });

    // 특정회원 조회
    router.get('/user/:idx', (req, res)=>{
        const idx = (parseInt(req.params.idx)||0);
        if (idx === 0) {
            res.status(200).send({});
        }
        const user = model.user.userFind(idx);
        user.then((result)=>{
            res.status(200).json(result);
        }).catch((error)=>{
            res.status(500).json(error);
        })
    });

    // 회원가입
    router.post('/user', (req, res)=>{
        const
            post = req.body,
            ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress); // ? 이게 고객의 ip가 맞는지 확인 필요
        let
            insert = {
                admin: 0,
                group: 1,
                name: post.name,
                company: post.company,
                type: sns_type[post.type],
                id: sns_prefix[post.type]+post.uniq,
                email: post.email,
                access_token: post.access_token,
                refresh_token: post.refresh_token,
                join_ip: ip,
            }
            ,token = md5(insert.id+Date.now())
        ;
        insert.token = token;

        // 테스트 아이디 삭제
        /*
            model.user.delete([
                {idx:2},
            ]).then((result)=>{
                res.status(200).json({result: result});
            }).catch((error)=>{
                res.status(500).json({result: error});
            });
        */

        // 기존 회원이 없다면 세션 굽고 그냥 완료 반환 한다.
        model.user.userFind(insert.id, 'id')
            .then((result)=>{
                if (result.idx) {
                    req.session.token = token;
                    return res.status(200).json({result: 'success'});
                } else {
                    // 데이터 추가
                    model.user.insert(insert).then(()=>{
                        req.session.token = token;
                        return res.status(200).json({result: 'success'});
                    }).catch((error)=>{
                        return res.status(500).json({result: error});
                    });
                }
            }).catch((error)=>{
                return res.status(500).json({result: error});
            })
        ;
    });
}