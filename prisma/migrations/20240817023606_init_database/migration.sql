-- CreateTable
CREATE TABLE `NguoiDung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `pass_word` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `birth_day` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `NguoiDung_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Phong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_phong` VARCHAR(191) NOT NULL,
    `khach` INTEGER NOT NULL,
    `phong_ngu` INTEGER NOT NULL,
    `giuong` INTEGER NOT NULL,
    `phong_tam` INTEGER NOT NULL,
    `mo_ta` VARCHAR(191) NOT NULL,
    `gia_tien` INTEGER NOT NULL,
    `may_giat` BOOLEAN NOT NULL,
    `ban_la` BOOLEAN NOT NULL,
    `tivi` BOOLEAN NOT NULL,
    `dieu_hoa` BOOLEAN NOT NULL,
    `wifi` BOOLEAN NOT NULL,
    `bep` BOOLEAN NOT NULL,
    `do_xe` BOOLEAN NOT NULL,
    `ban_ui` BOOLEAN NOT NULL,
    `hinh_anh` VARCHAR(191) NOT NULL,
    `viTriId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ViTri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_vi_tri` VARCHAR(191) NOT NULL,
    `tinh_thanh` VARCHAR(191) NOT NULL,
    `quoc_gia` VARCHAR(191) NOT NULL,
    `hinh_anh` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatPhong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_phong` INTEGER NOT NULL,
    `ngay_den` DATETIME(3) NOT NULL,
    `ngay_di` DATETIME(3) NOT NULL,
    `so_luong_khach` INTEGER NOT NULL,
    `ma_nguoi_dat` INTEGER NOT NULL,

    UNIQUE INDEX `DatPhong_ma_phong_ma_nguoi_dat_key`(`ma_phong`, `ma_nguoi_dat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BinhLuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_cong_viec` INTEGER NOT NULL,
    `ma_nguoi_binh_luan` INTEGER NOT NULL,
    `ngay_binh_luan` DATETIME(3) NOT NULL,
    `noi_dung` VARCHAR(191) NOT NULL,
    `sao_binh_luan` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Phong` ADD CONSTRAINT `Phong_viTriId_fkey` FOREIGN KEY (`viTriId`) REFERENCES `ViTri`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatPhong` ADD CONSTRAINT `DatPhong_ma_nguoi_dat_fkey` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `NguoiDung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatPhong` ADD CONSTRAINT `DatPhong_ma_phong_fkey` FOREIGN KEY (`ma_phong`) REFERENCES `Phong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_ma_nguoi_binh_luan_fkey` FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `NguoiDung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
