import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function main() {
    console.log("Starting seed...");

    // Clear existing data (be careful in production!)
    await prisma.session.deleteMany({});
    await prisma.textNode.deleteMany({});
    await prisma.bannerNode.deleteMany({});
    await prisma.projectSettings.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Cleared existing data");

    // Simple passwords for testing
    const password = await bcrypt.hash("test12345", 10);
    const adminPassword = await bcrypt.hash("admin12345", 10);

    // ─────────────────────────────────────────────────────────────────────────
    // USER WITH PROJECTS (main test user)
    // ─────────────────────────────────────────────────────────────────────────
    const userWithProjects = await prisma.user.create({
        data: {
            name: "userWithProjects",
            email: "with-projects@test.com",
            password: password,
            role: "USER",
        },
    });

    // Create project with content for userWithProjects
    const project = await prisma.project.create({
        data: {
            projectId: uuidv4(),
            name: "Sample Design Project",
            job: "JOB-001",
            title: "Sample Design",
            status: "In Progress",
            userId: userWithProjects.id,
        },
    });

    // Add text nodes
    await prisma.textNode.create({
        data: {
            projectId: project.id,
            elementId: "Text-001",
            name: "Heading",
            type: "text",
            locked: false,
            display: true,
            value: {
                text: "Welcome to the Designer Tool",
                position: { x: 100, y: 100 },
                size: { width: 500, height: 50 },
                typography: {
                    align: "left",
                    fontFamily: "Arial",
                    fontSize: 32,
                    fontStyle: "normal",
                    fontWeight: { key: "bold", label: "Bold", value: "700" },
                    lineHeight: 1.2,
                    letterSpacing: 0,
                },
                color: "#000000",
                rotation: 0,
                vertical: 1,
                horizontal: 1,
            },
        },
    });

    await prisma.textNode.create({
        data: {
            projectId: project.id,
            elementId: "Text-002",
            name: "Subtitle",
            type: "text",
            locked: false,
            display: true,
            value: {
                text: "Create beautiful designs with ease",
                position: { x: 100, y: 160 },
                size: { width: 500, height: 30 },
                typography: {
                    align: "left",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: { key: "regular", label: "Regular", value: "400" },
                    lineHeight: 1.2,
                    letterSpacing: 0,
                },
                color: "#666666",
                rotation: 0,
                vertical: 1,
                horizontal: 1,
            },
        },
    });

    // Add banner
    await prisma.bannerNode.create({
        data: {
            projectId: project.id,
            elementId: "Banner-001",
            name: "Main Banner",
            type: "banner",
            locked: false,
            display: true,
            value: {
                position: { x: 0, y: 0 },
                size: { width: 1200, height: 600 },
                scale: 1,
            },
        },
    });

    // Add project settings
    await prisma.projectSettings.create({
        data: {
            projectId: project.id,
            scale: 1,
            positionX: 0,
            positionY: 0,
        },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // USER WITHOUT PROJECTS (for empty state testing)
    // ─────────────────────────────────────────────────────────────────────────
    const userWithoutProjects = await prisma.user.create({
        data: {
            name: "userWithoutProjects",
            email: "no-projects@test.com",
            password: password,
            role: "USER",
        },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // OTHER USER WITH PROJECTS (for isolation testing - NOT used in tests)
    // Verifies that userWithProjects cannot see this user's projects
    // ─────────────────────────────────────────────────────────────────────────
    const otherUserWithProjects = await prisma.user.create({
        data: {
            name: "otherUserWithProjects",
            email: "other-user@test.com",
            password: password,
            role: "USER",
        },
    });

    // Create multiple empty projects for isolation testing
    await prisma.project.create({
        data: {
            projectId: uuidv4(),
            name: "Other User Project 1",
            job: "OTHER-001",
            title: "Should Not Be Visible",
            status: "Draft",
            userId: otherUserWithProjects.id,
        },
    });

    await prisma.project.create({
        data: {
            projectId: uuidv4(),
            name: "Other User Project 2",
            job: "OTHER-002",
            title: "Also Should Not Be Visible",
            status: "Active",
            userId: otherUserWithProjects.id,
        },
    });

    await prisma.project.create({
        data: {
            projectId: uuidv4(),
            name: "Other User Project 3",
            job: "OTHER-003",
            title: "Private Project",
            status: "Completed",
            userId: otherUserWithProjects.id,
        },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN USER
    // ─────────────────────────────────────────────────────────────────────────
    const admin = await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@test.com",
            password: adminPassword,
            role: "ADMIN",
        },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n✅ Seed completed successfully!");
    console.log("\n" + "━".repeat(60));
    console.log("TEST CREDENTIALS");
    console.log("━".repeat(60));
    console.log("\n📁 User WITH projects (use for testing):");
    console.log(`   Email:    ${userWithProjects.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Projects: 1 (with 2 texts, 1 banner)`);
    console.log("\n📭 User WITHOUT projects (use for empty state testing):");
    console.log(`   Email:    ${userWithoutProjects.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Projects: 0`);
    console.log("\n🔒 Other user (for isolation testing - DO NOT use in tests):");
    console.log(`   Email:    ${otherUserWithProjects.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Projects: 3 (empty, should not be visible to other users)`);
    console.log("\n👑 Admin:");
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n" + "━".repeat(60));
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