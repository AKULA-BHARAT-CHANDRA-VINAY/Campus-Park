

const login = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                regNo: "ADMIN001",
                password: "admin123"
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data:", data);

        if (data.success && data.token) {
            console.log("✅ Admin Login Test PASSED");
        } else {
            console.log("❌ Admin Login Test FAILED");
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

login();
