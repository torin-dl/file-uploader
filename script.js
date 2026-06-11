import { prisma } from "./lib/prisma.js";

async function main() {
    const newFile = await prisma.file.create({
        data: {
            path: "/tempPath",
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
