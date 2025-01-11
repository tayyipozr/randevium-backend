import { Category, Company, PrismaClient } from "@prisma/client";
import { Role } from "../../src/auth/enum";

const prisma = new PrismaClient()

async function main() {
  const roleList: Role[] = [Role.Admin, Role.CompanyAdmin, Role.CompanyEmployee, Role.User];
  for (var i = 0; i < roleList.length; i++) {
    await prisma.role.create({
      data: {
        name: roleList[i]
      }
    })
  }

  const categories: string[] = ["health", "scissors", "beauty_center", "cafe", "car_wash"];
  for (var i = 0; i < roleList.length; i++) {
    var category = await prisma.category.create({
      data: {
        name: categories[i]
      }
    })

    await prisma.categoryImage.create({
      data: {
        categoryId: category.id,
        imageUrl: "https://t3.ftcdn.net/jpg/03/59/09/04/360_F_359090423_7kA3WC9HnDEf1I9dx4ccGFhhO90vmzhk.jpg",
        order: 0
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
