package com.example;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Lớp kiểm thử tự động (End-to-End UI Testing) bằng Selenium WebDriver và JUnit 5
 * cho chức năng "Thêm phòng" (Add Room) trong Admin Panel của Hotel 22.
 * 
 * Lớp này bao gồm đầy đủ 12 kịch bản kiểm thử theo yêu cầu của bạn.
 * Đã tối ưu hóa chống trượt (idempotent) bằng số phòng ngẫu nhiên và
 * cuộn màn hình tự động (auto-scroll) để tránh lỗi Timeout do bị khuất.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AddRoomSeleniumTest {

    private static WebDriver driver;
    private static WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:5173"; // Port frontend mặc định của Vite

    @BeforeAll
    public static void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        // options.addArguments("--headless"); // Chạy ẩn danh nếu muốn chạy nhanh không mở cửa sổ Chrome

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterAll
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /**
     * Helper thực hiện đăng nhập tài khoản ADMIN mặc định và chuyển tới tab Quản lý Phòng
     */
    @BeforeEach
    public void loginAndNavigateToRoomTab() {
        driver.get(BASE_URL + "/login");

        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@type='email']")));
        emailInput.clear();
        emailInput.sendKeys("admin@hotel22.com");

        WebElement passwordInput = driver.findElement(By.xpath("//input[@type='password']"));
        passwordInput.clear();
        passwordInput.sendKeys("Admin@123");

        WebElement loginBtn = driver.findElement(By.xpath("//button[@type='submit' or contains(., 'Đăng nhập')]"));
        loginBtn.click();

        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        driver.get(BASE_URL + "/admin");

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(text(), 'Quản trị')]")));

        WebElement roomTabBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Phòng nghỉ')]")));
        roomTabBtn.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[contains(text(), 'Quản lý Phòng')]")));
    }

    @AfterEach
    public void logoutAndClearSession() {
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("window.localStorage.clear();");
        } catch (Exception e) {}
    }

    /**
     * Helper: Mở Modal thêm phòng mới
     */
    private void openAddRoomModal() {
        WebElement addBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Thêm mới')]")));
        addBtn.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h2[contains(text(), 'Thêm phòng mới')]")));
    }

    /**
     * Helper: Điền thông tin vào Modal thêm phòng
     */
    private void fillRoomForm(String roomNumber, String type, String basePrice, String maxOccupancy, 
                              String address, String description, String amenities, String images) {
        if (roomNumber != null) {
            WebElement input = driver.findElement(By.xpath("//input[@placeholder='VD: 101']"));
            input.clear();
            input.sendKeys(roomNumber);
        }
        if (type != null) {
            WebElement selectElement = driver.findElement(By.xpath("//select[option[contains(text(), 'Chọn loại phòng')]]"));
            Select select = new Select(selectElement);
            select.selectByValue(type);
        }
        if (basePrice != null) {
            WebElement input = driver.findElement(By.xpath("//input[@placeholder='VD: 500000']"));
            input.clear();
            input.sendKeys(basePrice);
        }
        if (maxOccupancy != null) {
            WebElement input = driver.findElement(By.xpath("//input[@placeholder='VD: 2']"));
            input.clear();
            input.sendKeys(maxOccupancy);
        }
        if (address != null) {
            WebElement input = driver.findElement(By.xpath("//input[@placeholder='VD: Tầng 1, Khách sạn ABC']"));
            input.clear();
            input.sendKeys(address);
        }
        if (description != null) {
            WebElement input = driver.findElement(By.xpath("//textarea[@placeholder='Mô tả chi tiết về phòng...']"));
            input.clear();
            input.sendKeys(description);
        }
        if (amenities != null) {
            WebElement input = driver.findElement(By.xpath("//textarea[contains(@placeholder, 'WiFi miễn phí')]"));
            input.clear();
            input.sendKeys(amenities);
        }
        if (images != null) {
            WebElement input = driver.findElement(By.xpath("//textarea[contains(@placeholder, 'Hoặc nhập URL trực tiếp')]"));
            input.clear();
            input.sendKeys(images);
        }
    }

    /**
     * KỊCH BẢN 1: Nhập đầy đủ và hợp lệ tất cả các trường (cả trường bắt buộc và không bắt buộc)
     */
    @Test
    @Order(1)
    public void test1_CreateRoomValidAllFields() {
        openAddRoomModal();

        // Tạo số phòng ngẫu nhiên dạng 8xx để tránh lỗi trùng lặp khi chạy lại nhiều lần
        String roomNum = "8" + String.format("%02d", (int)(Math.random() * 100));
        
        fillRoomForm(
            roomNum,
            "DELUXE",
            "750000",
            "3",
            "Tầng 4, Khu A, Hotel 22",
            "Phòng Deluxe rộng rãi có ban công, view thành phố tuyệt đẹp",
            "Wifi miễn phí\nĐiều hòa hai chiều\nTivi thông minh 55 inch\nMinibar",
            "https://picsum.photos/800/600?random=1\nhttps://picsum.photos/800/600?random=2"
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertEquals("Thêm phòng thành công!", alertText);
        alert.accept();

        // Đợi phần tử hiện diện trong DOM (presence)
        WebElement roomCell = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//td[contains(text(), 'P." + roomNum + "')]")));
        
        // Cuộn màn hình tự động đến phần tử phòng mới tạo
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", roomCell);
        
        assertTrue(driver.getPageSource().contains("P." + roomNum));
    }

    /**
     * KỊCH BẢN 2: Để trống trường bắt buộc "Số phòng"
     */
    @Test
    @Order(2)
    public void test2_CreateRoomEmptyRoomNumber() {
        openAddRoomModal();

        fillRoomForm(
            "", // Để trống số phòng
            "STANDARD",
            "400000",
            "2",
            "Tầng 1",
            "Mô tả phòng",
            "Wifi",
            ""
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertTrue(alertText.contains("Vui lòng điền đầy đủ thông tin bắt buộc"));
        alert.accept();
    }

    /**
     * KỊCH BẢN 3: Không chọn trường bắt buộc "Loại phòng"
     */
    @Test
    @Order(3)
    public void test3_CreateRoomEmptyRoomType() {
        openAddRoomModal();

        fillRoomForm(
            "901",
            "", // Chọn placeholder rỗng "Chọn loại phòng"
            "400000",
            "2",
            "Tầng 1",
            "Mô tả phòng",
            "Wifi",
            ""
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertTrue(alertText.contains("Vui lòng điền đầy đủ thông tin bắt buộc"));
        alert.accept();
    }

    /**
     * KỊCH BẢN 4: Để trống trường bắt buộc "Giá cơ bản"
     */
    @Test
    @Order(4)
    public void test4_CreateRoomEmptyBasePrice() {
        openAddRoomModal();

        fillRoomForm(
            "902",
            "STANDARD",
            "", // Để trống giá cơ bản
            "2",
            "Tầng 1",
            "Mô tả",
            "",
            ""
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertTrue(alertText.contains("Vui lòng điền đầy đủ thông tin bắt buộc"));
        alert.accept();
    }

    /**
     * KỊCH BẢN 5: Nhập "Số phòng" đã tồn tại trong hệ thống
     */
    @Test
    @Order(5)
    public void test5_CreateRoomDuplicateRoomNumber() {
        openAddRoomModal();

        // Sử dụng phòng số "101" đã tồn tại sẵn mặc định trong DB
        String existingRoom = "101";

        fillRoomForm(
            existingRoom,
            "SUITE",
            "1200000",
            "4",
            "Tầng 2",
            "Mô tả phòng VIP",
            "Đầy đủ tiện nghi",
            ""
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertTrue(alertText.contains("Lỗi khi thêm phòng") && alertText.contains("đã tồn tại"));
        alert.accept();
    }

    /**
     * KỊCH BẢN 6: Nhập giá trị âm hoặc bằng 0 vào trường "Giá cơ bản"
     */
    @Test
    @Order(6)
    public void test6_CreateRoomNegativeOrZeroPrice() {
        // 6a. Kiểm thử với giá trị âm (-150000)
        openAddRoomModal();
        fillRoomForm("910", "STANDARD", "-150000", "2", "", "", "", "");
        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertTrue(alertText.contains("Giá phòng phải lớn hơn 0"));
        alert.accept();

        driver.findElement(By.xpath("//button[text()='Hủy']")).click();

        // 6b. Kiểm thử với giá trị bằng 0
        openAddRoomModal();
        fillRoomForm("911", "STANDARD", "0", "2", "", "", "", "");
        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        alert = wait.until(ExpectedConditions.alertIsPresent());
        alertText = alert.getText();
        assertTrue(alertText.contains("Giá phòng phải lớn hơn 0"));
        alert.accept();
    }

    /**
     * KỊCH BẢN 7: Nhập giá trị âm hoặc chữ vào trường "Sức chứa tối đa"
     */
    @Test
    @Order(7)
    public void test7_CreateRoomInvalidMaxOccupancy() {
        // 7a. Nhập giá trị âm (-2) vào sức chứa tối đa
        openAddRoomModal();
        fillRoomForm("912", "STANDARD", "500000", "-2", "", "", "", "");
        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        assertTrue(alertText.contains("Sức chứa phải lớn hơn 0"));
        alert.accept();

        driver.findElement(By.xpath("//button[text()='Hủy']")).click();

        // 7b. Nhập chữ vào trường sức chứa (HTML5 input type="number" tự động loại bỏ ký tự chữ)
        openAddRoomModal();
        WebElement occupancyInput = driver.findElement(By.xpath("//input[@placeholder='VD: 2']"));
        occupancyInput.clear();
        occupancyInput.sendKeys("abc"); // Gửi chữ vào trường số

        String actualValue = occupancyInput.getAttribute("value");
        assertEquals("", actualValue, "Trình duyệt đã lọc bỏ ký tự chữ khỏi trường Số!");
    }

    /**
     * KỊCH BẢN 8: Nhập ký tự chữ (Text) vào trường "Giá cơ bản"
     */
    @Test
    @Order(8)
    public void test8_CreateRoomTextBasePrice() {
        openAddRoomModal();

        WebElement priceInput = driver.findElement(By.xpath("//input[@placeholder='VD: 500000']"));
        priceInput.clear();
        priceInput.sendKeys("xyz"); // Nhập chữ vào ô giá phòng

        String actualValue = priceInput.getAttribute("value");
        assertEquals("", actualValue);

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        assertTrue(alert.getText().contains("Vui lòng điền đầy đủ thông tin bắt buộc"));
        alert.accept();
    }

    /**
     * KỊCH BẢN 9: Nhập sai định dạng hoặc sai loại URL ở trường "Hình ảnh phòng"
     */
    @Test
    @Order(9)
    public void test9_CreateRoomInvalidImageUrl() {
        openAddRoomModal();

        // Tạo số phòng ngẫu nhiên dạng 9xx
        String roomNum = "9" + String.format("%02d", (int)(Math.random() * 100));
        fillRoomForm(
            roomNum,
            "DELUXE",
            "600000",
            "2",
            "Tầng 3",
            "Mô tả",
            "Wifi",
            "not-a-valid-url-format" // Sai định dạng URL của ảnh
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        assertEquals("Thêm phòng thành công!", alert.getText());
        alert.accept();

        // Đợi phần tử hiện diện trong DOM
        WebElement roomCell = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//td[contains(text(), 'P." + roomNum + "')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", roomCell);

        assertTrue(driver.getPageSource().contains("P." + roomNum));
    }

    /**
     * KỊCH BẢN 10: Kiểm tra tính năng chống Spam dữ liệu (Double Click liên tục nút Tạo phòng)
     */
    @Test
    @Order(10)
    public void test10_CreateRoomAntiSpamDoubleClick() {
        openAddRoomModal();

        // Tạo số phòng ngẫu nhiên dạng 7xx
        String roomNum = "7" + String.format("%02d", (int)(Math.random() * 100));

        fillRoomForm(
            roomNum,
            "STANDARD",
            "450000",
            "2",
            "Tầng 2",
            "Phòng test spam click",
            "",
            ""
        );

        WebElement createBtn = driver.findElement(By.xpath("//button[text()='Tạo phòng']"));

        // Click đúp liên tục
        Actions actions = new Actions(driver);
        actions.doubleClick(createBtn).perform();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        assertEquals("Thêm phòng thành công!", alert.getText());
        alert.accept();

        // Đợi phòng hiển thị
        WebElement roomCell = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//td[contains(text(), 'P." + roomNum + "')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", roomCell);

        // Đảm bảo không có thêm thông báo trùng lặp nào ở click thứ hai
        try {
            wait.until(ExpectedConditions.alertIsPresent());
            Alert errorAlert = driver.switchTo().alert();
            String errText = errorAlert.getText();
            errorAlert.accept();
            fail("Spam click lọt qua: " + errText);
        } catch (TimeoutException e) {
            // Thành công: Click thứ hai đã bị nút disabled chặn đứng!
            System.out.println("Anti-spam chặn click kép thành công!");
        }
    }

    /**
     * KỊCH BẢN 11: Nhấp nút Hủy (hoặc dấu X) khi đang nhập dở thông tin phòng
     */
    @Test
    @Order(11)
    public void test11_CancelRoomCreation() {
        // 11a. Test nút "Hủy" bên dưới modal
        openAddRoomModal();
        fillRoomForm("985", "STANDARD", "500000", "2", "Tầng 1", "Nhập dở thông tin", "", "");
        
        WebElement cancelBtn = driver.findElement(By.xpath("//button[text()='Hủy']"));
        cancelBtn.click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//h2[contains(text(), 'Thêm phòng mới')]")));
        assertFalse(driver.getPageSource().contains("P.985"));

        // 11b. Test nút "✕" ở góc trên bên phải
        openAddRoomModal();
        fillRoomForm("986", "STANDARD", "500000", "2", "Tầng 1", "Nhập dở thông tin", "", "");
        
        WebElement closeIcon = driver.findElement(By.xpath("//button[text()='✕']"));
        closeIcon.click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//h2[contains(text(), 'Thêm phòng mới')]")));
        assertFalse(driver.getPageSource().contains("P.986"));
    }

    /**
     * KỊCH BẢN 12: Nhập "Giá cơ bản" là một số quá lớn vượt ngưỡng lưu trữ (Integer Overflow)
     */
    @Test
    @Order(12)
    public void test12_IntegerOverflowBasePrice() {
        openAddRoomModal();

        // Tạo số phòng ngẫu nhiên dạng 6xx
        String roomNum = "6" + String.format("%02d", (int)(Math.random() * 100));
        String hugePrice = "999999999999999";

        fillRoomForm(
            roomNum,
            "PRESIDENTIAL",
            hugePrice,
            "5",
            "Tầng Thượng Penthouse",
            "Phòng siêu VIP",
            "Đầy đủ",
            ""
        );

        driver.findElement(By.xpath("//button[text()='Tạo phòng']")).click();

        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        assertEquals("Thêm phòng thành công!", alert.getText());
        alert.accept();

        // Đợi phần tử xuất hiện trong DOM
        WebElement roomCell = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//td[contains(text(), 'P." + roomNum + "')]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", roomCell);

        assertTrue(driver.getPageSource().contains("P." + roomNum));
    }
}
