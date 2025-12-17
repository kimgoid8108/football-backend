# 배포 가이드

## Render 백엔드 배포 설정

### 1. 환경 변수 설정

Render 대시보드에서 다음 환경 변수를 설정하세요:

```env
# 데이터베이스 타입 (Render에서는 PostgreSQL 필수)
DB_TYPE=postgres

# PostgreSQL 설정 (Render PostgreSQL 서비스에서 제공)
DB_HOST=your-postgres-host.onrender.com
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_SSL=true

# CORS 설정 (Vercel 프론트엔드 도메인)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend-git-main.vercel.app

# 환경 설정
NODE_ENV=production
PORT=10000
```

### 2. Render PostgreSQL 데이터베이스 생성

1. Render 대시보드에서 "New +" → "PostgreSQL" 선택
2. 데이터베이스 이름 설정
3. 생성 후 제공되는 연결 정보를 환경 변수에 입력

### 3. 중요 사항

⚠️ **Render에서는 SQLite를 사용할 수 없습니다!**
- Render의 파일 시스템은 영구적이지 않아 SQLite 데이터가 사라집니다
- 반드시 PostgreSQL을 사용해야 합니다

### 4. 빌드 명령어

Render에서 다음 설정을 사용하세요:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

## Vercel 프론트엔드 배포 설정

### 1. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### 2. Vercel 환경 변수 설정 방법

1. Vercel 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_API_URL` 추가
3. 값: `https://your-render-backend-url.onrender.com/api`

## 연결 확인

배포 후 다음을 확인하세요:

1. **프론트엔드 콘솔**: 브라우저 개발자 도구에서 API URL이 올바르게 설정되었는지 확인
2. **백엔드 로그**: Render 로그에서 데이터베이스 연결 성공 여부 확인
3. **CORS 오류**: 브라우저 콘솔에서 CORS 관련 오류가 없는지 확인

## 문제 해결

### 데이터가 저장되지 않는 경우

1. **PostgreSQL 연결 확인**
   - Render 로그에서 데이터베이스 연결 오류 확인
   - 환경 변수가 올바르게 설정되었는지 확인

2. **CORS 오류**
   - 백엔드 `ALLOWED_ORIGINS`에 프론트엔드 도메인이 포함되어 있는지 확인
   - Vercel 도메인은 자동으로 허용되지만, 커스텀 도메인은 추가 필요

3. **API URL 확인**
   - 프론트엔드 환경 변수 `NEXT_PUBLIC_API_URL`이 올바른지 확인
   - 브라우저 콘솔에서 실제 API URL 확인

### 로그 확인

- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Deployments → View Function Logs

