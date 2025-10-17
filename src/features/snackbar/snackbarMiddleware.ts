import type { Middleware } from "@reduxjs/toolkit";
import { showSnackbar } from "./snackbarSlice";


function isActionWithType(action: unknown): action is { type: string; payload?: any; error?: any } {
    return typeof action === "object" && action !== null && "type" in action;
}

export const snackbarMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    if (!isActionWithType(action)) return result;

    if (typeof action.type === "string") {
        //  Success 
        if (action.type.endsWith("Success")) {
            const lowerType = action.type.toLowerCase();
            let message = "Amal muvaffaqiyatli bajarildi ✅";

            if (/create/i.test(lowerType)) message = "Muvaffaqiyatli qo‘shildi ✅";
            else if (/update/i.test(lowerType)) message = "Ma'lumot yangilandi 🔄";
            else if (/delete/i.test(lowerType)) message = "Muvaffaqiyatli o‘chirildi 🗑️";
            else if (/clearbonuses/i.test(lowerType)) message = "Bonuslar tozalandi 💰";
            else if (/purchase/i.test(lowerType)) message = "Xarid muvaffaqiyatli qo‘shildi 🛍️";
            else if (/login/i.test(lowerType)) message = "Tizimga muvaffaqiyatli kirildi 👋";
            else if (/logout/i.test(lowerType)) message = "Tizimdan chiqildi 👋";

            // ⚙️ Fetch yoki Get actionlar uchun snackbar chiqmasin
            if (/fetch|get/i.test(lowerType)) return result;

            store.dispatch(
                showSnackbar({
                    message,
                    severity: "success",
                })
            );
        }

        // Failure
        if (action.type.endsWith("Failure")) {
            const e = action.payload
            console.log(e);
            console.log(action);

            const errorMessage =
                e?.response?.data?.error ||
                e?.response?.data?.message ||
                e?.response?.data?.detail ||
                e?.error ||
                (typeof e === "string" ? e : e?.message) ||
                "Noma’lum xatolik yuz berdi!"
            store.dispatch(
                showSnackbar({
                    message: errorMessage,
                    severity: "error",
                })
            );
        }
    }

    return result;
};


