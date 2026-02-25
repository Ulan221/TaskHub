import { validateAuth } from '@/utils/validation';


describe('Auth Validation Logic', () => {
    test('возвращает ошибку, если в email нет @', () => {
        const result = validateAuth('invalid-email', '123456');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBe("Please enter a valid email");
    });

    test('возвращает ошибку, если пароль меньше 6 символов', () => {
        const result = validateAuth('test@mail.com', '12345');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBe("Please enter at least 6 characters");
    });

    test('возвращает isValid: true для корректных данных', () => {
        const result = validateAuth('work@mail.com', 'password123');
        expect(result.isValid).toBe(true);
        expect(result.errorMessage).toBe(null);
    });
});