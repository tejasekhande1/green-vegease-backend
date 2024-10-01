export function generateProfilePictureUrl(
    firstName: string,
    lastName: string,
): string {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`;
}
