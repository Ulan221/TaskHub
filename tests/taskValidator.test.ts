import {isTaskValid} from "@/utils/taskValidator";


describe("isTaskValid", () => {
    test("Возврашает ощибку если нет пользователя",  () => {
        const result = isTaskValid( null , '123456');
        expect(result).toBe(false);
    });
    test("Возвращает ощибку если есть пробелв", () => {
        const result = isTaskValid({}, '  ');
        expect(result).toBe(false);
    });
    test("Возвращает правильно", () => {
        const result = isTaskValid({}, 'text');
        expect(result).toBe(true);
    });
})