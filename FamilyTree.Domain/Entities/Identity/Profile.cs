namespace FamilyTree.Domain.Entities.Identity
{
    public class Profile
    {
        public int Id { get; set; }

        public ApplicationUser User { get; set; }
    }
}
