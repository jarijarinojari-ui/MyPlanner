const t = window.plannerI18n.t;
document.querySelectorAll('[data-toggle]').forEach(button => {
    const input = document.getElementById(button.dataset.toggle);
    button.addEventListener('click', () => {
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        button.textContent = visible ? t('숨기기') : t('보기');
        button.setAttribute('aria-pressed', String(visible));
        button.setAttribute('aria-label', t(input.id === 'passwordConfirm' ? (visible ? '비밀번호 확인 숨기기' : '비밀번호 확인 표시') : (visible ? '비밀번호 숨기기' : '비밀번호 표시')));
    });
});
const signup = document.getElementById('signup-form');
if (signup) {
    const password = document.getElementById('password');
    const confirm = document.getElementById('passwordConfirm');
    const validate = () => {
        password.setCustomValidity(new TextEncoder().encode(password.value).length > 72 ? t('비밀번호는 UTF-8 기준 72바이트 이하로 입력해 주세요.') : '');
        confirm.setCustomValidity(confirm.value && password.value !== confirm.value ? t('비밀번호가 일치하지 않아요.') : '');
    };
    password.addEventListener('input', validate);
    confirm.addEventListener('input', validate);
    signup.addEventListener('submit', event => { validate(); if (!signup.reportValidity()) event.preventDefault(); });
}

window.addEventListener('planner-language-change', () => {
 document.querySelectorAll('[data-toggle]').forEach(button => {
 const visible = document.getElementById(button.dataset.toggle).type === 'text';
 button.textContent = t(visible ? '숨기기' : '보기');
 button.setAttribute('aria-label', t(button.dataset.toggle === 'passwordConfirm' ? (visible ? '비밀번호 확인 숨기기' : '비밀번호 확인 표시') : (visible ? '비밀번호 숨기기' : '비밀번호 표시')));
 });
 document.getElementById('password')?.dispatchEvent(new Event('input'));
});
