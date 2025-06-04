---
title:
aliases:
tags:
  - 씨앗
---
# 목적
Kuernetes로 플랫폼을 구성한다손 치면 수많은 [[ODIC]] client를 만들어야 합니다. [[Keycloak]]에서 client를 만들고 client secret을 발급합니다. Client secret을 Kubernetes Secret으로 다시 만들고, 이를 실제 애플리케이션에 마운트하는 단계가 필요합니다.

적힌 그대로 작업한다면 은근히 수작업을 많이 해야 합니다.

또 Keycloak Client 정보(client ID, redirect url, …)는 대부분 변경없이 사용됩니다. 하지만 secret만은 계속 변경(regenerate)되어야 하며, 변경된 값이 실제 애플리케이션에도 반영되어야 합니다. 이 또한 많은 수작업을 필요로 합니다.

이 글에서는 Keycloak의 Client secret을 Vault로 관리하고, secret 관리를 자동화하는 방법을 제안합니다.

## 초기 학습
> 싹 다 갈아엎었습니다.
### Vault Secret Operator의 CRD
- **vaultauthglobals**: K8S Service Account에 Vault Policy를 부여합니다. (cluster-wide)
- **vaultauths**: K8S Service Account에 Vault Policy를 부여합니다. (namespace-wide)
- **vaultconnections**: Vault 인스턴스의 연결 구성을 관리합니다. dev, stg, prod 환경별 Vault 서버를 둘 때 사용합니다.
- **vaultpkisecrets**: TLS 인증서 발급 및 갱신을 자동화
- **vaultdynamicsecrets**: [Vault 동적 시크릿](https://developer.hashicorp.com/vault/tutorials/get-started/understand-static-dynamic-secrets)을 Kubernetes Secret으로 동기화
- **vaultstaticsecrets**: 일반적인 Secret을 Kuernetes Secret으로 동기화
- **hcpvaultsecretsapps**: Vault SaaS의 Secret을 Kubernetes에 동기화 (유료 기능)

- [Automating Secret Updates for Keycloak Clients in Kubernetes with Argo CD and Post-Sync Hooks](https://medium.com/@isurusathsara183/automating-secret-updates-for-keycloak-clients-in-kubernetes-with-argo-cd-and-post-sync-hooks-e6dafdb07293)
### 고민하는 거
- Secret을 업데이트한다고 바로 Pod에 반영되지 않는다. Pod이 Secret을 Volume으로 참조한다면 즉시 업데이트하지만, 환경변수로 참조한다면 재시작을 해주어야 한다.
### 자동화를 한다면
1. **Client Secret 발급(수동)**: 사용자는 Keycloak UI에서 Secret을 생성한다. (API로도 가능)
2. Keycloak이 생성한 Secret을 Vault에 저장한다.
3. Vault에 저장된 Secret을 Kubernetes Secret으로 만든다.
### 깨달음
Terraform으로 Keycloak client를 관리할 수 있다..!


---

## 시나리오

![](https://i.imgur.com/H2nsXdZ.png)



## 

```bash
vault secrets enable -path=secret kv-v2 vault write auth/approle/role/webhook secret_id_ttl=10m token_ttl=15m
```